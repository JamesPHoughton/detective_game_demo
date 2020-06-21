"""
This design simplifies the multiple different treatment conditions to just two:
fully interdependent, and as close to independent as possible.

This design puts the treatment and control in the same empirica "game", so that
individuals are properly randomized between the treatment and control
conditions.

Also, the control clue set is the 'star' pattern, with additional information
about the focal elements provided, rather than random unconnected edges.

Also explicitly includes which options are presented to players after the game
finishes.

This updates design4 with new spur clues pretested on Mturk
and the {CrimeScene} style templating
"""


import numpy as np
import pandas as pd
import itertools
import copy
import networkx as nx
import random
import string
import json
import yaml
import datetime

root_dir = "games/"


def make_matched_pair():
    # make social network
    np.random.seed()
    g = nx.dodecahedral_graph()
    n_players = nx.number_of_nodes(g)

    neighbors = {}
    player_positions = []
    for n in g:
        neighbors['t' + str(n)] = ['t' + str(nb)
                                   for nb in g.neighbors(n)]  # nodes in treatment
        player_positions.append('t' + str(n))
        neighbors['c' + str(n)] = ['c' + str(nb)
                                   for nb in g.neighbors(n)]  # nodes in control
        player_positions.append('c' + str(n))

    np.random.shuffle(player_positions)

    # make clues
    clues_spreadsheet = "Clues.xlsx"

    potential_nodes_df = pd.read_excel(
        clues_spreadsheet, sheet_name="Nodes List", dtype=str)
    # remove extraneous whitespaces
    potential_nodes_df.columns = [col.strip()
                                  for col in potential_nodes_df.columns]
    potential_nodes_dict = {}
    for col in potential_nodes_df.columns:
        random.shuffle(potential_nodes_df[col])
        i = 0
        for val in potential_nodes_df[col]:
            if isinstance(val, str) or not np.isnan(val):
                potential_nodes_dict['%s_%i' % (col, i)] = val
                i += 1

    # edges are the unfilled clues
    treatment_edges = pd.read_excel(
        clues_spreadsheet, sheet_name="Treatment Edges")
    treatment_edges.set_index("index", inplace=True, drop=True)
    treatment_edges.columns = [col.strip() for col in treatment_edges.columns]
    treatment_edges = treatment_edges.loc[pd.notnull(
        treatment_edges.index)]  # drop null rows

    spur_edges = pd.read_excel(clues_spreadsheet, sheet_name="Control Edges")
    spur_edges.set_index("index", inplace=True, drop=True)
    spur_edges.columns = [col.strip() for col in treatment_edges.columns]
    # only keeping the spurs, using the spokes from treatment
    spur_edges = spur_edges.loc['spur1':]

    spur_edges_dict = {}  # easier to use as a dictionary
    for col in spur_edges.columns:
        spur_edges_dict[col] = list(spur_edges[col].values)
        random.shuffle(spur_edges_dict[col])

    treatment_clues = dict()
    control_clues = dict()
    for row_num, (row, series) in enumerate(treatment_edges.iterrows()):
        for col_num, (col, edge) in enumerate(series.iteritems()):
            # only do above the diagonal
            if row_num < col_num and isinstance(edge, str) and edge != "-":
                # treatment clues
                col_node, row_node = [s.split('}')[0]
                                      for s in edge.split('{') if '}' in s]

                clue_content = fill_template(edge, potential_nodes_dict)
                clue_id = "tclue_%i_%i" % (row_num + 1, col_num + 1)
                treatment_clues[clue_id] = {
                    "id": clue_id,
                    "nodeNames": [col, row],
                    "nodes": [potential_nodes_dict[col_node],
                              potential_nodes_dict[row_node]],
                    "edge": edge,
                    "content": clue_content,
                }

                # control clues
                # if in the core, keep
                if set([row, col]).intersection({"CrimeScene_1", "StolenObject_1"}):
                    clue_id = "cclue_%i_%i" % (row_num + 1, col_num + 1)
                    control_clues[clue_id] = {
                        "id": clue_id,
                        "nodeNames": [col, row],
                        "nodes": [potential_nodes_dict[col_node],
                                  potential_nodes_dict[row_node]],
                        "edge": edge,
                        "content": clue_content,
                    }

                else:  # otherwise use control edges
                    # alternate whether we replace row or col
                    nodeName = col if (row_num + col_num) % 2 == 1 else row
                    c_edge = spur_edges_dict[nodeName].pop()
                    clue_content = fill_template(c_edge, potential_nodes_dict)
                    clue_id = "cclue_%i_%i" % (row_num + 1, col_num + 1)
                    ns = [s.split('}')[0]
                          for s in c_edge.split('{') if '}' in s]
                    control_clues[clue_id] = {
                        "id": clue_id,
                        "nodeNames": ns,
                        "nodes": [potential_nodes_dict[ns[0]], potential_nodes_dict[ns[1]] if len(ns) > 1 else c_edge],
                        "edge": c_edge,
                        "content": clue_content,
                    }

    # distribute clues amongst players
    n_beliefs = 4
    beliefs_needed = n_players * n_beliefs
    clues_available = len(treatment_clues)

    treatment_clue_list = list(treatment_clues.keys(
    )) + ['tclue_1_2'] * (beliefs_needed - clues_available)
    random.shuffle(treatment_clue_list)
    beliefs = {}
    # technically don't need to randomize here as well...
    for n in np.random.permutation(list(range(n_players))):
        treatment_player_clue_keys = treatment_clue_list[:n_beliefs]
        treatment_clue_list = treatment_clue_list[n_beliefs:]
        beliefs['t' + str(n)] = treatment_player_clue_keys
        # give corresponding player corresponding clues
        beliefs['c' + str(n)] = ['c' + s[1:]
                                 for s in treatment_player_clue_keys]

    clues = {**treatment_clues, **control_clues}  # merge into one clue dict

    nodes = {k: potential_nodes_dict[k] for k in [
        "CrimeScene_1", "StolenObject_1",
        "Suspect_1", "Suspect_2", "Suspect_3",
        "Clothing_1", "Clothing_2",
        "Appearance_1", "Appearance_2",
        "Tool_1", "Tool_2",
        "Vehicle_1", "Vehicle_2"
    ]}

    return neighbors, clues, beliefs, nodes, player_positions


def format_content(edge, col_node, row_node):
    content = edge.replace('{row}', row_node).replace('{col}', col_node)
    return content[0].upper() + content[1:] + '.'


def fill_template(edge, nodes):
    content = edge.format(**nodes)
    return content[0].upper() + content[1:] + '.'


playerCount_factor_type_id = ''.join(random.choices(
    '23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz', k=17))
duration_factor_type_id = ''.join(random.choices(
    '23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz', k=17))
gameSetupId_factor_type_id = ''.join(random.choices(
    '23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz', k=17))
experimentDataFile_factor_type_id = ''.join(random.choices(
    '23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz', k=17))
botsCount_factor_type_id = ''.join(random.choices(
    '23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz', k=17))

test_playerCount_factor_id = ''.join(random.choices(
    '23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz', k=17))
test_duration_factor_id = ''.join(random.choices(
    '23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz', k=17))
play_8_min_factor_id = ''.join(random.choices(
    '23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz', k=17))
bots_40_factor_id = ''.join(random.choices(
    '23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz', k=17))
bots_39_factor_id = ''.join(random.choices(
    '23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz', k=17))
bots_0_factor_id = ''.join(random.choices(
    '23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz', k=17))

default_config = {
    "treatments": [
        #         {
        #             "name": "",
        #             "factorIds": []
        #         }
    ],
    "factorTypes": [
        {
            "_id": playerCount_factor_type_id,
            "name": "playerCount",
            "description": "The number of players in a given game.",
            "required": "true",
            "type": "Integer",
            "min": 1
        },
        {
            "_id": duration_factor_type_id,
            "name": "duration",
            "description": "The length of the game in minutes.",
            "required": "true",
            "type": "Integer",
            "min": 0
        },
        {
            "_id": gameSetupId_factor_type_id,
            "name": "gameSetupId",
            "description": "Which game setup to use for the game.",
            "required": "false",
            "type": "String"
        },
        {
            "_id": experimentDataFile_factor_type_id,
            "name": "experimentDataFile",
            "description": "which json file to load the experiment data from",
            "required": "false",
            "type": "String"
        },
        {
            "_id": botsCount_factor_type_id,
            "name": "botsCount",
            "description": "how many bots to launch",
            "required": "false",
            "type": "Integer",
            "min": 0,
            "max": 40,
        }
    ],
    "factors": [
        {
            "_id": test_playerCount_factor_id,
            "name": "TestPlayers",
            "value": 4,
            "factorTypeId": playerCount_factor_type_id
        },
        {
            "_id": test_duration_factor_id,
            "name": "playOneMin",
            "value": 1,
            "factorTypeId": duration_factor_type_id
        },
        {
            "_id": play_8_min_factor_id,
            "name": "play8Min",
            "value": 8,
            "factorTypeId": duration_factor_type_id
        },
        {
            "_id": bots_40_factor_id,
            "name": "fortyBots",
            "value": 40,
            "factorTypeId": botsCount_factor_type_id
        },
        {
            "_id": bots_39_factor_id,
            "name": "thirtynineBots",
            "value": 39,
            "factorTypeId": botsCount_factor_type_id
        },
        {
            "_id": bots_0_factor_id,
            "name": "noBots",
            "value": 0,
            "factorTypeId": botsCount_factor_type_id
        }
    ],
    "lobbyConfigs": [
        {
            "timeoutType": "lobby",
            "timeoutInSeconds": 1500000,
            "timeoutStrategy": "fail",
            "gameLobbyIds": []
        }
    ],
}


def generate_experiment_data_file(replications=2):
    """ Args: n_players, deg, n_beliefs, n_concepts, target, replications"""
    n_players = 20  # dodecahedral graph
    deg = 3  # dodecahedral graph
    n_beliefs = 4  # max manageable for cognitive load

    config = copy.deepcopy(default_config)
    playerCount_factor_id = ''.join(random.choices(
        '23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz', k=17))
    config["factors"].append({
        "_id": playerCount_factor_id,
        "name": "run_%i_player" % (n_players * 2),
        "value": n_players * 2,
        "factorTypeId": playerCount_factor_type_id
    })

    # Experiment parameters
    experiment_setup_name = 'exp_design6_matched_bots_' + \
        datetime.datetime.now().strftime("%Y%m%d_%H%M%S")

    experiment = {'experiment_setup_name': experiment_setup_name,
                  "games": {},
                  "p_broken_list": 'matched inter/indep pair',
                  "n_players": n_players,
                  "deg": deg,
                  "n_beliefs": n_beliefs,
                  "replications": replications
                  }

    experiment_filename = "%s.json" % experiment_setup_name
    experiment_factor_id = ''.join(random.choices(
        '23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz', k=17))
    config["factors"].append({
        "_id": experiment_factor_id,
        "name": experiment_setup_name,
        "value": experiment_filename,
        "factorTypeId": experimentDataFile_factor_type_id
    })

    # replication parameters
    for rep in range(replications):
        game_setup_name = 'panel_%i_matched_pair_%s' % (
            rep, experiment_setup_name)
        game_data = {
            'panelId': 'panel_%i_%s' % (rep, experiment_setup_name),
            'gameSetupId': game_setup_name,
            "panel": rep,
            "pBroken": "matched pair 0, 1",
            "nPlayers": n_players,
            "rep_number": rep,
            "deg": deg,
            'experiment': experiment_setup_name,
        }

        (game_data['neighbors'], game_data['clues'],
         game_data['beliefs'], game_data['nodes'], game_data['playerPositions']
         ) = make_matched_pair()

        # log it
        experiment["games"][game_setup_name] = game_data

        # add to the config
        game_setup_factor_id = ''.join(random.choices(
            '23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz', k=17))
        config['factors'].append({
            "_id": game_setup_factor_id,
            "name": game_setup_name,
            "value": game_setup_name,
            "factorTypeId": gameSetupId_factor_type_id
        })
        config['treatments'].append({
            "name": game_setup_name,
            "factorIds": [game_setup_factor_id,
                          play_8_min_factor_id,
                          playerCount_factor_id,
                          experiment_factor_id,
                          bots_0_factor_id]
        })

        # bots only game
        config['treatments'].append({
            "name": game_setup_name+'_allBots',
            "factorIds": [game_setup_factor_id,
                          play_8_min_factor_id,
                          playerCount_factor_id,
                          experiment_factor_id,
                          bots_40_factor_id]
        })

        # # solo
        # config['treatments'].append({
        #     "name": game_setup_name+'_solo',
        #     "factorIds": [game_setup_factor_id,
        #                   play_8_min_factor_id,
        #                   playerCount_factor_id,
        #                   experiment_factor_id,
        #                   bots_39_factor_id]
        # })

        # make caveman games
        edgelist = [(0,1), (0,2), (0,3),
                    (1,2), (1,3),
                    (2,7),
                    (4,5), (4,6), (4,7),
                    (5,6), (5,7),
                    (6,11),
                    (8,9), (8,10), (8,11),
                    (9,10), (9,11),
                    (10,15),
                    (12,13), (12,14), (12,15),
                    (13,14), (13,15),
                    (14,19),
                    (16,17), (16,18), (16,19),
                    (17,18), (17,19),
                    (18,3)]

        g = nx.from_edgelist(edgelist)

        neighbors = {}
        for n in g:
            neighbors['t' + str(n)] = ['t' + str(nb)
                                       for nb in g.neighbors(n)]  # nodes in treatment
            neighbors['c' + str(n)] = ['c' + str(nb)
                                       for nb in g.neighbors(n)]  # nodes in control


        game_setup_name = 'panel_%i_matched_pair_caveman_%s' % (
            rep, experiment_setup_name)
        caveman_game_data = copy.deepcopy(game_data)
        caveman_game_data['panelId'] = 'caveman_panel_%i_%s' % (rep, experiment_setup_name),
        caveman_game_data['gameSetupId'] = game_setup_name
        caveman_game_data['neighbors'] = neighbors

        # log the caeman game
        experiment["games"][game_setup_name] = caveman_game_data

        # add to the config
        game_setup_factor_id = ''.join(random.choices(
            '23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz', k=17))
        config['factors'].append({
            "_id": game_setup_factor_id,
            "name": game_setup_name,
            "value": game_setup_name,
            "factorTypeId": gameSetupId_factor_type_id
        })
        config['treatments'].append({
            "name": game_setup_name,
            "factorIds": [game_setup_factor_id,
                          play_8_min_factor_id,
                          playerCount_factor_id,
                          experiment_factor_id]
        })

        # bots only game
        config['treatments'].append({
            "name": game_setup_name+'_allBots',
            "factorIds": [game_setup_factor_id,
                          play_8_min_factor_id,
                          playerCount_factor_id,
                          experiment_factor_id,
                          bots_40_factor_id]
        })

        # # solo
        # config['treatments'].append({
        #     "name": game_setup_name+'_solo',
        #     "factorIds": [game_setup_factor_id,
        #                   play_8_min_factor_id,
        #                   playerCount_factor_id,
        #                   experiment_factor_id,
        #                   bots_39_factor_id]
        # })


    # save the experiment file
    with open(root_dir + experiment_filename, 'w') as outfile:
        json.dump(experiment, outfile)

    # add the test treatment
    config['treatments'].append({
        "name": "soloGame",
        "factorIds": [game_setup_factor_id,
                      test_duration_factor_id,
                      playerCount_factor_id,
                      experiment_factor_id,
                      bots_39_factor_id]
    })

    # save an empirica config file for the experiment
    config_filename = root_dir + "%s.yaml" % experiment_setup_name
    with open(config_filename, 'w') as config_file:
        yaml.dump(config, config_file)

    return experiment_filename


generate_experiment_data_file(60)
