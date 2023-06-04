import { useEffect, useState } from "react";
import Chart from "./components/Chart";

const EDUCATION_URL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
const COUNTY_URL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

function App() {
  const [data, setData] = useState(null);

  const getData = async () => {
    const educationResponse = await fetch(EDUCATION_URL);
    const countyResponse = await fetch(COUNTY_URL);

    const education = await educationResponse.json();
    const county = await countyResponse.json();

    setData({ education, county });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <main className="w-screen h-screen max-w-screen max-h-screen font-jakarta">
      <div className="w-full h-full flex flex-col justify-between items-center py-8">
        <div className="text-neutral-950 text-center space-y-2">
          <h1 className="text-3xl font-medium">
            United States Educational Attainment
          </h1>
          <p className="text-light">
            Percentage of adults age 25 and older with a bachelor's degree or
            higher (2010-2014)
          </p>
        </div>
        <div id="tooltip"></div>
        {data ? <Chart data={data} /> : null}
      </div>
    </main>
  );
}

export default App;
