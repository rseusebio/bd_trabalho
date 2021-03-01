import React from 'react';
import PieChart from "./charts/PieChart";
import AttendancePieChart from "./charts/AttendancePieChart";
import RatioBarChart from './charts/RatioBarChart';
import OutcomeBarChart from './charts/OutcomeBarChart';
import "./App.css";
import CuredBarChart from './charts/CuredBarChart';
import CovidPositiveLineChart from './charts/CovidPostiveLineChart';
import DeathsMonthLineChart from './charts/DeathsMonthLineChart';
import CovidPerAgeBarChart from './charts/CovidPerAgeBarChart';


function App() {
  return (
    <div 
      className={"root-container"}>

      <div className={"flex-row-container"}>
        
        <div className={"piechart-class"}>
          <PieChart/>
        </div>

        <div className={"piechart-class"}>
          <AttendancePieChart/>
        </div>

        <div className={"piechart-class"}>
          <RatioBarChart />
        </div>

      </div>

      <div className={"flex-row-container"}>
        
        <div className={"barchart-class"}>
          <OutcomeBarChart/>
        </div>

        <div className={"barchart-class"}>
          <CuredBarChart/>
        </div>

        <div className={"barchart-class"}>
          <CovidPositiveLineChart/>
        </div>

      </div>

      <div className={"flex-row-container"}>
        
        <div className={"barchart-class"}>
          <DeathsMonthLineChart/>
        </div>
        
        <div className={"barchart-class"}>
          <CovidPerAgeBarChart/>
        </div>

          
      </div>

    </div>
  );
}

export default App;
