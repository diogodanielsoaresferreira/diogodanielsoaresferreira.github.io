---
layout: post
title: "Maximize the potential of your football players with Machine Learning"
date: 2020-08-27
excerpt: "Learn to create a model that calculates the best position of your players"
tags: [football, machine learning]
comments: true
---

<figure>
    <a href="/assets/img/football-players/capa.jpeg"><img src="/assets/img/football-players/capa.jpeg" style="max-width: 80%"></a>
    <figcaption style="text-align: center">Photo by <a href="https://unsplash.com/@jasonrc23" target="_blank">jason charters</a> on Unsplash</figcaption>
</figure>


Hi there! When you are watching your favorite football team, have you ever got that feeling that there is a player that has great potential, but is playing in the wrong position? Do you think that if the manager would put him in a different position he would be so much better? Well, I do! How can we develop a tool that uses **artificial intelligence to help us detect the best-suited positions for players?**


In this post I will show how to train a machine learning model to detect the best positions of a player, using a Football Manager dataset. Then, I will analyze some players and compare the predicted positions with the real positions of the players. You can check the Jupyter notebook with the code for this blog post [here](https://colab.research.google.com/github/diogodanielsoaresferreira/football_machine_learning/blob/master/Predict%20players%20positions.ipynb).

---

Several players changed their position successfully in their careers. **Andrea Pirlo** is perhaps one of the most successful cases. He started as an offensive midfielder but failed to impress in Inter Milan in 2001, due to his lack of pace and stamina. During a loan in Brescia, which also had Roberto Baggio as a trequartista, the coach Carlo Mazzone made the impressive decision to deploy Pirlo as a deep-lying playmaker. Due to his technique and passing ability, Pirlo became perhaps the best deep-lying playmaker of all time, inspiring a new generation of defensive midfielders.


<figure>
    <a href="/assets/img/football-players/pirlo.jpg"><img src="/assets/img/football-players/pirlo.jpg" style="max-width: 80%"></a>
    <figcaption style="text-align: center">Andrea Pirlo (Wikipedia)</figcaption>
</figure>

Another well-known case of switching positions is **Bale**. When he changed from Southampton to Tottenham, he became one of the fastest left-backs that the world has ever seen. However, by the hand of Harry Redknapp in 2012, he turned into a left-winger, making him the most expensive player in the world when he was bought by Real Madrid in 2013.


<figure>
    <a href="/assets/img/football-players/bale.jpg"><img src="/assets/img/football-players/bale.jpg" style="max-width: 80%"></a>
    <figcaption style="text-align: center">Gareth Bale (Wikipedia)</figcaption>
</figure>


While in those cases the players moved positions while still young, there are also cases when the players change positions to take advantage of their new characteristics as they get old. For many years, **Ryan Giggs** was the left-winger of Man United. In the later years of his career, his pace decreased, while at the same time his passing skills were better than ever. His change to the central midfield benefited both him and Man United, leading them to the Champions League final in 2009 and 2011.

There are many more players that changed positions successfully: Javier Mascherano, Sergio Ramos, Thierry Henry, Fábio Coentrão, Matic, or Vincent Kompany are some of the examples. The goal of this post is to show how to create a model that predicts the best positions of a player, to allow him to reach his potential earlier in his career.


---

To do that, we will use a dataset with player attributes, valued from 1 to 20. We will use **data from the game Football Manager 2017**, available in [Kaggle](https://www.kaggle.com/ajinkyablaze/football-manager-data). Football Manager is widely known as having one of the most reliable and extensive worldwide football players datasets.

We will train a machine learning model that learns to classify the players' positions based on their attributes. Each player can be classified as having more than one suited position for him to play.

A **disclaimer** about the data must be made. The dataset is obviously biased, since the players' attributes were hand given, and they were given knowing the position of the player a priori. However, it was my choice to made this analysis based on the attributes given to the players and not based on the player stats (number of passes, number of goals, etc.), since they are affected by the positions in which the players have played in.


---

Enough talking! Let's **train the model**. The full notebook can be found [here](https://colab.research.google.com/github/diogodanielsoaresferreira/football_machine_learning/blob/master/Predict%20players%20positions.ipynb).

When defining the position for each player, we can see that each player has a score for each position, from 1 to 20. We will classify a player as well suited for a position if its score for that position is 15 or more.

<script src="https://gist.github.com/diogodanielsoaresferreira/17160fcecaa26063656d9322d82e79bc.js"></script>

We will train three models: a **K-neighbors classifier, a Random Forest, and a neural network**. I chose those three algorithms because they have native support for multilabel classification. For each model, it will be applied 5-fold cross-validation, and the F1-score will be measured. The predictions for every player will also be stored.

<script src="https://gist.github.com/diogodanielsoaresferreira/c91245d139191b01221a11d1d3d196f9.js"></script>

The results of the cross-validation have shown us that the neural network is the worst performer in this task, achieving an F1-score of 48.61%. Both the K-neighbors and the Random Forest algorithms achieve an F1-score near 60%. Because the training time of the Random Forest is lower, I chose the Random Forest model to make predictions about the players. After the hyper-parameters are chosen, I train the model one last time with the entire dataset.

In the end, we get two artifacts that we will use:
* **the trained model** with all the players in the dataset;
* **the prediction of the position of each player**, trained in a 5-fold cross-validation approach.

---

After having the model trained, **let's play with it!** We can manually set each player's attribute to a numeric value, and analyze the output of the model. With that, we can inspect the most important attributes for each position.

For example, starting with the attributes of **Cristiano Ronaldo**, it predicts the positions of Striker, Left Attacking Midfielder, Right Attacking Midfielder, and Left Midfielder. Let's try to reduce the finishing attribute value, that is set to 19. Interestingly enough, when the finishing attribute drops below 10, the model only predicts the positions Left and Right Attacking Midfielder. The Striker and Left Midfielder positions are not predicted due to the low finishing skils. We can also see that changing only the age, height or weight does not affect directly the predicted positions.

<figure>
    <a href="/assets/img/football-players/screen.png"><img src="/assets/img/football-players/screen.png" style="max-width: 100%"></a>
</figure>


If the Freekicks attribute drops below 4, the Left Midfield position is not predicted. Maybe the model learned that left midfielders are good at free-kicks. If the heading attribute drops, not only the Striker and the Left Midfield positions are not predicted, but the attacking central midfielder position is predicted. It makes sense since the heading attribute is rarely needed for an attacking central midfielder.

Anyway, there is a lot to try and explore with the attributes in the model. **Try it yourself with your favorite players!**

---

Besides the model, **we also have the predicted position of each player**. We can inspect the player positions that the model predicted and see if it discovered potential positions where the players could achieve its full potential.

Let's test with 10 players:

<script src="https://gist.github.com/diogodanielsoaresferreira/068133039f46808c4f66afa6c32b827e.js"></script>

* **Cristiano Ronaldo** - the predicted positions are in the central area of the field, which makes sense in this latter part of his career;

* **Lionel Messi** - the predicted positions are central and left attacking midfielder, which does not contain the striker position when compared to the actual positions; it is also understandable, since Messi is everything but a regular striker - its heading or finishing skills are not outstanding;

* **Neymar** - similar to Messi, all the real positions are predicted with exception to the striker position, probably for the same reasons; I would argue that striker is not the best position for any of them, at least as a lone striker;

* **Kevin De Bruyne** - the actual best positions of De Bruyne in FM 2017 are all midfield and attacking midfield positions; our predicted best positions are central attacking midfield and left attacking midfield;

* **Harry Kane** - both the actual and the predicted positions are the same (striker);

* **Luka Modric** - both the actual and the predicted positions are the same (central attacking midfield and central midfield);

* **Manuel Neuer** - both the actual and the predicted positions are the same (Goalkeeper);

* **Phillip Lahm** - Lahm is a challenging player because it can play in several positions; our predicted position is right defender, which is its original position;

* **Andrea Pirlo** - Pirlo is another challenging example, having started its career as a central attacking midfielder but having more success as a defensive midfielder; our prediction is central midfield and central attacking midfield, probably due to his remarkable vision and passing attributes;

* **Gareth Bale** - the predicted positions for Bale are central and left attacking midfield, which was the position that made him the most expensive player in the world in 2013.

In recap, **it seems that the model can accurately predict the area of the field of a player (goalkeeping/defense/midfield/striker), and it can give some insights to the players of where it can be its best position.**

Try it with your favorite players!

Thanks for reading!
