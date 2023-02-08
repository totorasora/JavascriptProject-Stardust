const results1 = fetch(
    "https://population.un.org/dataportalapi/api/v1/data/indicators/49/locations/900?startYear=2023&endYear=2023&sexes=3&pagingInHeader=false&format=json"
  )
    .then((response) => response.json())
    .then((data) => console.log(data));



const suicide = fetch("http://api.worldbank.org/v2/en/indicator/SH.STA.SUIC?format=json")
  .then(response => response.json())
  .then(data => { console.log(data)
  });


function print_pop(data) {
const pop_year = data[1].value - data[0].value;
document.getElementByld("pop").innerText = `Population Growth: ${pop_year}`;
}

fetch(
"https://population.un.org/dataportalapi/api/vi/data/indicators/49/locations/900?startYear=2022&endYear=2023&sexes=3&paqingInHeader=false&format=¡son&variants=4"
.then((response) => response.json()))
.then((response) => print_pop(response.data));



function num_pop() {
  const data = fetch(
    "https://population.un.org/dataportalapi/api/vi/data/indicators/49/locations/900?startYear=2022&endYear=2023&sexes=3&paqingInHeader=false&format=¡son&variants=4"
    .then((response) => response.json()))
    .data;
  const pop_year = data[1].value - data[0].value;
  return pop_year;
// document.getElementByld("pop").innerText = `Population Growth: ${pop_year}`;
}