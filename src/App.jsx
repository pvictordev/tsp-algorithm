import React, { useState, useEffect } from "react";
import "./App.css";

const NUM_CITIES = 20;
const POPULATION_SIZE = 100;
const MUTATION_RATE = 0.1;
const GENERATIONS = 100;

// Generate random cities
const cities = Array.from({ length: NUM_CITIES }, () => ({
  x: Math.random() * 500,
  y: Math.random() * 500,
}));

// Calculate distance between two cities
const distance = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

// Compute total route distance
const routeDistance = (route) => {
  let dist = 0;
  for (let i = 0; i < route.length - 1; i++) {
    dist += distance(route[i], route[i + 1]);
  }
  return dist + distance(route[route.length - 1], route[0]);
};

// Create initial population
const createPopulation = () =>
  Array.from({ length: POPULATION_SIZE }, () =>
    [...cities].sort(() => Math.random() - 0.5)
  );

// Selection - tournament selection
const selectParents = (population) => {
  return population
    .sort((a, b) => routeDistance(a) - routeDistance(b))
    .slice(0, 10);
};

// Crossover - ordered crossover
const crossover = (parent1, parent2) => {
  const start = Math.floor(Math.random() * parent1.length);
  const end = Math.floor(start + Math.random() * (parent1.length - start));
  const child = parent1.slice(start, end);
  parent2.forEach((gene) => {
    if (!child.includes(gene)) child.push(gene);
  });
  return child;
};

// Mutation - swap mutation
const mutate = (route) => {
  if (Math.random() < MUTATION_RATE) {
    const i = Math.floor(Math.random() * route.length);
    const j = Math.floor(Math.random() * route.length);
    [route[i], route[j]] = [route[j], route[i]];
  }
  return route;
};

// Genetic Algorithm Execution
const runGeneticAlgorithm = () => {
  let population = createPopulation();
  for (let i = 0; i < GENERATIONS; i++) {
    const parents = selectParents(population);
    let newPopulation = [];
    while (newPopulation.length < POPULATION_SIZE) {
      const [p1, p2] = [
        parents[Math.floor(Math.random() * parents.length)],
        parents[Math.floor(Math.random() * parents.length)],
      ];
      let child = crossover(p1, p2);
      child = mutate(child);
      newPopulation.push(child);
    }
    population = newPopulation;
  }
  return population.sort((a, b) => routeDistance(a) - routeDistance(b))[0];
};

const TSPGenetic = () => {
  const [bestRoute, setBestRoute] = useState(null);

  const generateNewRoute = () => {
    setBestRoute(runGeneticAlgorithm());
  };

  useEffect(() => {
    generateNewRoute();
  }, []);

  return (
    <div>
      <div className="tsp-container">
        <div className="tsp-block">
          <svg height="550" width="550" style={{ border: "1px solid black" }}>
            {cities.map((city, index) => (
              <circle key={index} cx={city.x} cy={city.y} r={5} fill="red" />
            ))}
            {bestRoute &&
              bestRoute.map((city, index) => {
                const nextCity = bestRoute[(index + 1) % bestRoute.length];
                return (
                  <line
                    key={index}
                    x1={city.x}
                    y1={city.y}
                    x2={nextCity.x}
                    y2={nextCity.y}
                    stroke="blue"
                  />
                );
              })}
          </svg>
          <button onClick={generateNewRoute}>Generate New Route</button>
        </div>
      </div>
    </div>
  );
};

export default TSPGenetic;
