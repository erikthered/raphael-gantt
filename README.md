raphael-gantt
=============

Draw gantt charts with Raphaël and Moment.js

### Introduction
**HEADS UP!** This is still under heavy development so the code isn't super great right now and will likely change drastically in the future.

My intent with this project is to provide an easy way to create gantt charts backed by intuitively structured JSON data.
I'm using Raphaël to draw the chart itself and Moment.js to simplify all the date related activties.

More information coming soon!

### Usage
To start, pass the id of the element you want the chart to be drawn inside

    var chart = new GanttChart("chart");
    
Next, pass the data you want to render via the load data function

    var payload = [{
        name: "Project Name", startDate: "2012-06-28", endDate: "2012-07-10",
        phases : [
          {name : "Phase 1", startDate: "2012-06-28", endDate: "2012-07-04", 
            tasks : [
              {name : "Task 1", startDate: "2012-06-28", endDate: "2012-07-01"},
              {name : "Task 2", startDate: "2012-06-29", endDate: "2012-07-04"}
            ]
          },
          {name : "Phase 2", startDate: "2012-07-05", endDate: "2012-07-10",
            tasks : [
              {name : "Task 3", startDate: "2012-07-05", endDate: "2012-07-08"},
              {name : "Task 4", startDate: "2012-07-09", endDate: "2012-07-10"}
            ]
          }
        ]
      }];
      chart.loadData(payload);
      
Finally, call the draw method

    chart.draw();

### Dependencies
* Raphaël
* Moment.js