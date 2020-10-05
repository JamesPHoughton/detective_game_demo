# Detective Game

This repository contains code for running the Detective Game, an experiment design that allows researchers to study
the simultaneous social contagion of multiple beliefs in a controlled setting.
The game was originally developed to explore the effect of interdependence between beliefs
on polarization, but can be adapted with both informational and display manipulations.

This implementation includes training screens, an "exposition" to the case, the game itself, a post-game "make the case" survey, and follow-up questionaire, shown in the images below.

![Gameplay Training](/docs/training1.png)
![Incentives](/docs/training2.png)
![Game Exposition](/docs/exposition.png)
![Game Play](/docs/game.png)
![Make-the-case](/docs/make_the_case.png)
![Confidence](/docs/confidence.png)

The game makes use of the [Empirica](https://empirica.ly/) and the Meteor framework. Many first-class resources exist to help beginners [deploy Meteor apps](https://galaxy-guide.meteor.com/deploy-guide.html) on cloud servers.

**To test locally, type `meteor` in this project's home directory.**

To modify the information environment and clue structure, edit one of the example configuration files found in `/private/`,
or use `design_demo_game.py` to programmatically generate a clue set with your desired properties.

To modify the display, modify any of the react components found in `/client/game/`.

Happy coding!
