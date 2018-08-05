# Neuroevolution Fighting Bots
Simulación de pelea de vehículos utilizando redes neuronales y algoritmos geneticos.

## Objetivos
Desarrollar una red neuronal a través de algoritmos genéticos con la capacidad de, implementada en un vehículo móvil con capacidad de disparar, apuntar, disparar y esquivar cuando se coloca a pelear contra otro vehículo con una red neuronal similar.

## Simulación
Ambos vehículos tienen la capacidad de girar hacia ambos lados, avanzar, retroceder y disparar, además de contar con un campo de visión delantero para detectar objetivos. Ambos vehículos son colocados a los lados de la pista y empiezan viéndose entre sí. Las acciones que cada uno tomará se harán en base a los resultados de la red neuronal. Dicha red evalúa ciertos parámetros como la posición del robot y bala enemiga, la posición propia, entre otros. Cada vehículo obtendrá puntuación en base a la precisión de sus disparos y su capacidad de esquivar balas enemigas. En base a dicha puntuación, el algoritmo genético hará que la red neuronal evolucione y cada vez obtener mejores puntuaciones. Cada generación tiene una duración de 650 cuadros y, al finalizar este período, una nueva generación es creada a partir de algoritmos genéticos.

## Red Neuronal
### Modelo
El modelo utilizado es una red neuronal completamente conectada (figura 1) y esta constituida por siete entradas, seis nodos intermedios y cinco salidas. Cada uno de estos parámetros es explicado a continuación.

<p align="center">
  <img src="https://github.com/gnoya/Neuroevolution-Fighting-Bots/blob/master/results/redNeuronal.png" width="700">
  </br>
  Figura 1: Modelo de la red neuronal.
</p>

  |  Entrada   |     Variable   |
  | ---------- | --------------:|
  |     X1     | Propio X       |
  |     X2     | Propio Y       |
  |     X3     | Propio ángulo  |
  |     X4     | Bala enemiga X |
  |     X5     | Bala enemiga Y |
  |     X6     | Enemigo X      |
  |     X7     | Enemigo Y      |

  |   Salida   |      Acción      |
  | ---------- | ----------------:|
  |     Y1     |  Avanzar         |
  |     Y2     |  Retroceder      |
  |     Y3     |  Disparar        |
  |     Y4     |  Girar izquierda |
  |     Y5     |  Girar derecha   |

De no ser detectado ninguna bala enemiga, las entradas X4 y X5 son colocadas en 0.
De no ser detectado ningún robot enemigo, las entradas X6 y X7 son colocadas en 0.


### Inicialización de la red neuronal
El peso entre cada neurona es inicializado de manera aleatoria entre -1 y 1.

## Algoritmos genéticos
Se implementó un algoritmo genético con una población de 150 individuos y un índice de mutación de 7.5 %. Cada individuo es un par de vehículos, uno azul y uno rojo. Cada vehículo solo interactúa con su pareja y no con los demás. Luego, se juntan todos los vehículos azules y se les aplica algoritmos genéticos. Este procedimiento también se realiza en los vehículos rojos. La puntuación dependerá de su habilidad de esquivar y su puntería al disparar.

### Fitness
Cada vez que el vehículo dispara, se crea un vector unitario desde el centro del robot indicando la dirección de tiro. Luego, se crea un vector unitario entre el centro del vehículo y el centro del vehículo enemigo. El producto punto de estos vectores resultará en el ángulo entre ellos, como se observa en la figura 2. 

<p align="center">
  <img src="https://github.com/gnoya/Neuroevolution-Fighting-Bots/blob/master/results/vectors.png" width="500">
  </br>
  Figura 2: Cálculo del error del ángulo de tiro.
</p>

En base a este ángulo y a la función de la figura 3, se suma la puntuación. Luego, si el disparo conecta con el vehículo enemigo, se añade una puntuación extra. 

<p align="center">
  <img src="https://github.com/gnoya/Neuroevolution-Fighting-Bots/blob/master/results/fitness.png" width="500">
  </br>
  Figura 3: Función de fitness para el disparo.
</p>

Para evaluar la capacidad de esquivar, se evalúa si el disparo fue lo suficientemente bueno. En caso de ser menor a cierto ángulo, se considerará que el disparo acertará. De cumplirse este caso y que la bala no golpee al vehículo, se considerará como una evasión y se sumará puntuación al vehículo que esquivó. En cualquier caso, si el vehículo es impactado por una bala enemiga, se reducirá su puntuación.

### Selección natural
Se utilizó una selección por ruleta de la fortuna en base a las puntuaciones previamente explicadas. Se eligen dos padres de un mismo color (azul o rojo) para dar origen a un nuevo individuo de su mismo color.

### Crossover
El cruce de genes implementado en este proyecto se basa en el cruce de pesos de cada red neuronal. Es decir, se recorre la matríz de pesos vacía del nuevo individuo y se va llenando con el peso en la correspondiente posición de la matríz de pesos de los padres. Para elegir de qué padre se tomará ese peso, se elige un numero aleatorio, si es menor a 0.5 se elige al padre A, si no, se elige al padre B. Este procedimiento se ilustra en la figura 4.

<p align="center">
  <img src="https://github.com/gnoya/Neuroevolution-Fighting-Bots/blob/master/results/crossover.png" width="500">
  </br>
  Figura 4: Cruce de genes.
</p>

### Mutación
La mutación consiste en alterar en una pequeña magnitud uno de los pesos entre neuronas. Se recorrerá la matríz de pesos de cada nuevo individuo, y para cada peso se generará un número aleatorio. Si ese número es menor al índice de mutación (0.075), el peso se modifica ligeramente.

## Resultados
Se obtuvieron resultados con menor eficiencia de lo esperado. Se puede notar que los vehículos solo aprenden a realizar una acción, disparar o esquivar. Este resultado será explicado de mejor manera en las conclusiones. En las siguientes figuras se pueden observar algunos resultados obtenidos. 

<p align="center">
  <img src="https://github.com/gnoya/Neuroevolution-Fighting-Bots/blob/master/results/NeuroBots.gif">
  </br>
  Figura 5: Resultados parte 1.
</p>

Véase que en la figura 5, el vehículo azul dispara y esquiva de manera correcta, sin embargo, el rojo no aprendió a esquivar, solo a disparar.

<p align="center">
  <img src="https://github.com/gnoya/Neuroevolution-Fighting-Bots/blob/master/results/NeuroBots2.gif">
  </br>
  Figura 6: Resultados parte 2.
</p>

En la figura 6, el vehículo azul se detiene cuando esta por impactar con una bala enemiga, pero su precisión de tiro es mediocre. En cambio, el vehículo rojo dispara de manera correcta pero no aprendió a esquivar.


## Conclusiones
Es dificil entrenar a la misma red neuronal para que realice dos acciones totalmente distintas (disparar y esquivar) con el método utilizado, ya que el algoritmo genético premia a cada red juzgando de la puntuación acumulada entre disparar y esquivar, y no de manera individual. De esta manera, o la red evoluciona en base a sus habilidades de esquivar o en base a sus habilidades de disparar, muy rara vez evolucionan de manera conjunta.


## Realizado con
[P5.js](https://github.com/processing/p5.js "P5.js library")

[Toy-Neural-Network-JS](https://github.com/CodingTrain/Toy-Neural-Network-JS "Toy Nerual Network library")

## Como usar
Descargar el repositorio y abrir el archivo index.html. Todos los parámetros para su funcionamiento estan declaradas como constantes en el archivo /js/main.js y pueden ser modificables para intentar lograr mejores resultados. 
