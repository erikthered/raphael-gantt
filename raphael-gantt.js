function GanttChart(elementId){
  this.elementId = elementId;
  this.height = 500;
  this.width = 500;
  this.gridSize = 25;
  this.labelAreaSize = 100;
  this.currentRow = 1; // Starts at 1 so there is an empty row for headers
  this.phaseColor = "#AAA";
  this.taskColors = ["#C24704","#D9CC3C","#FFEB79","#A0E0A9","#00ADA7"];
  this.cellpadding = 4;

  var colorCounter = 0;

  this.loadData = function(payload){
    this.project = payload;
  }

  this.draw = function(){
    // Get the list of dates for the project duration
    var dates = this.getDates();
    // Calculate total graph width
    width = this.labelAreaSize + dates.length * this.gridSize;
    var rows = this.getRows();
    height = rows*this.gridSize;

    // Generate the chart area
    this.paper = Raphael(this.elementId, width, height);

    this.grid();
    this.headers(dates);

    // Iterate through all the phases, print labels and child tasks
    var phases = this.project[0].phases;
    for(p in phases){
      var caption = this.paper.text(5,(this.currentRow*this.gridSize)+(this.gridSize/2),phases[p].name);
      caption.attr({"font-size":14 , "stroke":"none" , "fill":"black", "text-anchor":"start"});

      //TODO print phase bounds
      this.phaseLine(phases[p]);

      this.currentRow++;

      var tasks = phases[p].tasks;
      for(t in tasks){
        this.bar(tasks[t]);
        this.currentRow++;
      }

      // Cycle the selected color, tasks under a phase will have the same color
      if(colorCounter < this.taskColors.length){
        colorCounter++;
      }else{
        colorCounter = 0;
      }
    }

  }

  // Gets the total number of rows
  this.getRows = function(){
    var phases = this.project[0].phases;
    var rows = 1;
    for (p in phases){
      rows++;
      var tasks = phases[p].tasks;
      for(t in tasks){
        rows++;
      }
    }
    return rows;
  }

  // Draw the grid
  this.grid = function(){
    // Draw horizontal grid lines
    for(var y=this.gridSize; y < height; y+=this.gridSize){
      var pathExp = "M0," + y + "L" + width + "," + y;
      var gridLine = this.paper.path(pathExp);
      gridLine.attr({"stroke":"#000"});
    }

    //Draw vertical grid lines (starts at the edge of the space allotted for phase/task labels)
    for(var x=this.labelAreaSize; x < width; x+=this.gridSize){
      var pathExp = "M" + x + ",0L" + x + "," + height;
      var gridLine = this.paper.path(pathExp);
    }
  }

  // Draws column headers, currently using M-D formatting
  this.headers = function(dates){
    var currentCol = 0;
    for(d in dates){
      var heading = this.paper.text(this.labelAreaSize + currentCol*this.gridSize + .5*this.gridSize, .5*this.gridSize,dates[d].format("M-D"));
      heading.attr({"text-anchor":"middle"});
      currentCol++;
    }
  }

  // Draw phase bounding shape
  this.phaseLine = function(phase){
    var dates = this.getDates();
    var startDate = moment(phase.startDate);
    var endDate = moment(phase.endDate);
    endDate.add("days",1); // Add an extra day so that the bar actually encompasses the end date

    var offset = moment.duration(startDate - dates[0]);

    var x = offset.asDays()*this.gridSize+this.labelAreaSize+this.cellpadding;
    var y = this.currentRow*this.gridSize+.25*this.gridSize;
    var duration = moment.duration(endDate-startDate);
    var barWidth = (duration.asDays())*this.gridSize-(2*this.cellpadding);
    var barHeight = this.gridSize/4;

    var bar = this.paper.rect(x, y, barWidth, barHeight);
    bar.attr({"stroke":this.phaseColor});
    bar.attr({"fill":this.phaseColor});

    // Draw the starting bound triangle
    var p1 = x+","+y;
    var p2 = x+","+((y+.75*this.gridSize)-this.cellpadding);
    var p3 = (x+.5*this.gridSize)+","+y;
    var startTriangle = this.paper.path("M"+p1+"L"+p2+"L"+p3+"Z");
    startTriangle.attr({"stroke":this.phaseColor,"fill":this.phaseColor});

    // Draw the ending bound triangle
    var p1 = x+barWidth+","+y;
    var p2 = x+barWidth+","+((y+.75*this.gridSize)-this.cellpadding);
    var p3 = ((x+barWidth)-.5*this.gridSize)+","+y;
    var endTriangle = this.paper.path("M"+p1+"L"+p2+"L"+p3+"Z");
    endTriangle.attr({"stroke":this.phaseColor,"fill":this.phaseColor});

  }

  // Draws a task bar
  this.bar = function(task){
    var dates = this.getDates();
    var startDate = moment(task.startDate);
    var endDate = moment(task.endDate);
    endDate.add("days",1); // Add an extra day so that the bar actually encompasses the end date

    var offset = moment.duration(startDate - dates[0]);

    var x = offset.asDays()*this.gridSize+this.labelAreaSize;
    var y = this.currentRow*this.gridSize;
    var duration = moment.duration(endDate-startDate);
    var barWidth = (duration.asDays())*this.gridSize;
    var barHeight = this.gridSize;

    var bar = this.paper.rect(x+this.cellpadding, y+this.cellpadding, barWidth-(2*this.cellpadding), barHeight-(2*this.cellpadding));
    var caption = this.paper.text(10,y+(barHeight/2),task.name);
    caption.attr({"font-size":14 , "stroke":"none" , "fill":"black", "text-anchor":"start"});

    var fill = this.taskColors[colorCounter];
    bar.attr({"fill":fill});
    bar.hover(function(){
      bar.animate({"fill":"red"},100);
    }, function(){
      bar.animate({"fill":fill},100);
    });

  }

  // Returns an array of dates for the duration of the project
  this.getDates = function(){
    //TODO Parse start/end dates from data
    var startDate = moment(this.project[0].startDate);
    var endDate = moment(this.project[0].endDate);

    var dates = [];

    while(startDate <= endDate){
      dates.push(startDate.clone());
      startDate.add("days",1);
    }

    return dates;
  }

}