function GanttChart(elementId){
  this.elementId = elementId;
  this.height = 500;
  this.width = 500;
  this.gridSize = 25;
  this.labelAreaSize = 100;
  this.currentRow = 1; // Starts at 1 so there is an empty row for headers


  this.loadData = function(payload){
    this.phases = payload;
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
    var phases = this.phases;
    for(p in phases){
      //TODO print phase bounds
      var caption = this.paper.text(5,(this.currentRow*this.gridSize)+(this.gridSize/2),phases[p].name);
      caption.attr({"font-size":14 , "stroke":"none" , "fill":"black", "text-anchor":"start"});

      this.currentRow++;

      var tasks = phases[p].tasks;
      for(t in tasks){
        this.bar(tasks[t]);
        this.currentRow++;
      }
    }

  }

  // Gets the total number of rows
  this.getRows = function(){
    var phases = this.phases;
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

  // Draws a task bar
  this.bar = function(task){
    var x = task.startOffset*this.gridSize+this.labelAreaSize;
    var y = this.currentRow*this.gridSize;
    var barWidth = task.length*this.gridSize;
    var barHeight = this.gridSize;

    var bar = this.paper.rect(x, y, barWidth, barHeight);
    var caption = this.paper.text(10,y+(barHeight/2),task.name);
    caption.attr({"font-size":14 , "stroke":"none" , "fill":"black", "text-anchor":"start"});

    bar.attr({"fill":"#000"});
    bar.hover(function(){
      bar.animate({"fill":"red"},100);
    }, function(){
      bar.animate({"fill":"#000"},100);
    });

  }

  // Returns an array of dates for the duration of the project
  this.getDates = function(){
    //TODO Parse start/end dates from data
    var startDate = moment();
    var endDate = startDate.clone();
    endDate.add("months",1);

    var dates = [];

    while(startDate < endDate){
      dates.push(startDate.clone());
      startDate.add("days",1);
    }

    return dates;
  }

}