# ProfusFinderBroker

ProfusFinderBroker est un petit soft permettant de rechercher dans tout les équipements les meilleurs ratio.

Il utilise pour récupérer les ratios des items https://profus.net/home et https://docs.dofusdu.de/ pour rechercher la liste des items.

**Attention**, les valeurs sont actualisé par la communautée elle ne sont pas forcement bonne.

## Installation

> Récupération du projet : 
>    - Installer git
>    - Installer node
>    - Executer dans un terminal :
>         - cd "emplacement de votre dossier"
>         - git clone git@github.com:NelsonPhilippe/ProfsuFinderBroker.git
>         - cd ProfsuFinderBroker
>         - npm install


## Utilisation

Le soft génère 2 fichiers un fichier collections qui récupère tout les équipements du jeu (à partir du level 100 pour le moment), et un second qui lui récupère les ratios des items (pour le moment au dessus de 200 de ratio).

Le fichier des ratios ce regénère si il date de plus d'une semaine.

> Executions du soft :
>   - npm start