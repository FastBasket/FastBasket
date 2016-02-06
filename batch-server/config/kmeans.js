_ = require('underscore');
HR = [37.78774223089045, -122.40866616368294];
// HR = [-122.40866616368294, 37.78774223089045];
// bob = [{y:37.79174413982033, x:-122.3985381424427, id: 1},
//   {y:37.788963175233846, x:-122.39656403660774, id: 2},
//   {y:37.79805179347195, x:-122.41227105259895, id: 4},
//   {y:37.801035872043144, x:-122.4179358780384, id: 3},
//   {y:37.78591077655136, x:-122.42814972996712, id: 6},
//   {y:37.77994127700315, x:-122.44231179356575, id: 5},
//   {y:37.774988939930005, x:-122.40351632237434, id: 8},
//   {y:37.77743122981216, x:-122.40943863987923, id: 7}
// ];


// HR = [0,0]
// bob = [
//   {x: 5, y: 1, id: 1},
//   {x: 6, y: 1, id: 1},
//   {x: 7, y: 2, id: 1},
//   {x: -1, y: 1, id: 2},
//   {x: -5.5, y: 5, id: 2},
//   {x: 0, y: 6, id: 3},
//   {x: 0.1, y: 6, id: 3},
//   {x: 0.2, y: 7, id: 3},
//   {x: 6, y: 9, id: 5},
//   {x: -4, y: -6, id: 6}
// ]

//define vector class
vector = function(obj){
  this.x = obj.x;
  this.y = obj.y;
  this.id = obj.id;
};

vector.prototype = {
  subtract: function(b){
    return new vector({
      x: this.x - b.x,
      y: this.y - b.y,
      id: this.id
    });
  },
  dot: function(b){
    return (this.x * b.x) + (this.y * b.y);
  },
  length: function(){
    return Math.sqrt((this.x * this.x) + (this.y * this.y));
  },
  get_angle: function(){

  },
  delta_angle: function(b){
    return Math.acos( Math.round( this.dot(b) / (this.length() * b.length() )* 1000000) / 1000000);
  },
  add: function(b){
    return new vector({
      x: this.x + b.x,
      y: this.y + b.y,
      id: this.id
    });
  },
  scale: function(k){
    return new vector({
      x: this.x/k,
      y: this.y/k,
      id: this.id
    });
  },
  normalize: function(){
    return new vector({
      x: this.x/this.length(),
      y: this.y/this.length(),
      id: this.id
    });
  }
};

HackR = new vector({
  x: HR[0],
  y: HR[1],
  id: 'HR'
});
unitX = new vector({
  x: 1,
  y: 0,
  id: 'UNITX'
});
ZERO = new vector({
  x: 0,
  y: 0,
  id: 'ZERO'
});

kmeans = function(array, k , r){
  var clusters;
  // convert{ x: , y: , id: } into vector
  vectors = _.map(array, function(element){
    vec = new vector(element);
    return vec.subtract(HackR);
//     return vec;
  });


  // guess centers
  // range = _.range(k)

  centers = _.map(_.range(k) ,function(n){
    coord = {
      x: Math.round(Math.cos(2*Math.PI*n/k)* 1000000)/1000000,
      y: Math.round(Math.sin(2*Math.PI*n/k)* 1000000)/1000000,
      id: 'center_' + n
    };
    return new vector(coord);
  });

for(var x = 0; x < r; x++){
  // find closest cluster
  console.log('====================  ' + x + '  ======================');
  clusters = {};

  _.each(centers, function(c, i){
    clusters[i] = [];
  });

  _.each(vectors, function(vec){
    d_angle = _.map(centers, function(cen){
      return Math.abs(vec.delta_angle(cen) );

    });
    // index of min
    min = Math.min.apply(null, d_angle );
    clusters[d_angle.indexOf(min)].push(vec);
  });

  // recalc centers.
    _.each(clusters, function(buck, cent){
      if(buck.length){
        // angles = _.map(buck, function(vec){
        //   return vec.delta_angle(unitX);
        // });
        //
        // var sum = _.reduce(angles, function(a, b) { return a + b; });
        // var avg = sum / angles.length;

        // centers[cent] = new vector ({
        //   x: Math.cos(avg),
        //   y: Math.sin(avg),
        //   id: 'cluster_' + cent
        // });

        sum = _.reduce(buck, function(a,b){
          return a.add(b.normalize());
        }, ZERO);
        avg = sum.normalize();
        centers[cent] = avg;
      }
    });
      console.log(clusters);
      console.log(centers);
  }

  return clusters;
};


module.exports = kmeans;
