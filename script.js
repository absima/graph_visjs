
// import { gpdata } from "./grouping.js"
const gpdata =
{
  "proj1": {
    "group1": [
      "Katrin",
      "Luben",
      "Jens",
      "Zan"
    ],
    "group2": [
      "Sima",
      "Marina",
      "Julio",
      "David"
    ],
    "group3": [
      "Fi",
      "Bruno",
      "Sivak",
      "Fabian"
    ],
    "group4": [
      "Victor",
      "Samin",
      "Arthi",
      "Malaiz"
    ]
  },
  "proj2": {
    "group1": [
      "Fi",
      "Sima",
      "Jens",
      "Marina"
    ],
    "group2": [
      "Julio",
      "Luben",
      "Samin",
      "Sivak"
    ],
    "group3": [
      "David",
      "Bruno",
      "Arthi",
      "Zan"
    ],
    "group4": [
      "Fabian",
      "Katrin",
      "Victor",
      "Malaiz"
    ]
  },
  "proj3": {
    "group1": [
      "David",
      "Sivak",
      "Malaiz",
      "Victor"
    ],
    "group2": [
      "Katrin",
      "Marina",
      "Arthi",
      "Fabian"
    ],
    "group3": [
      "Fi",
      "Luben",
      "Jens",
      "Zan"
    ],
    "group4": [
      "Sima",
      "Bruno",
      "Samin",
      "Julio"
    ]
  },
  "proj4": {
    "group1": [
      "Sivak",
      "Sima",
      "Fi",
      "Arthi"
    ],
    "group2": [
      "Malaiz",
      "Jens",
      "Fabian"
    ],
    "group3": [
      "David",
      "Katrin",
      "Luben",
      "Zan"
    ],
    "group4": [
      "Bruno",
      "Samin",
      "Victor",
      "Marina"
    ]
  },
  "proj5": {
    "group1": [
      "Luben",
      "David",
      "Arthi",
      "Fi"
    ],
    "group2": [
      "Katrin",
      "Victor",
      "Fabian",
      "Sivak"
    ],
    "group3": [
      "Bruno",
      "Samin",
      "Marina",
      "Jens"
    ]
  },
  "proj6": {
    "group1": [
      "Sivak",
      "David",
      "Katrin",
      "Samin"
    ],
    "group2": [
      "Victor",
      "Marina",
      "Malaiz"
    ],
    "group3": [
      "Fi",
      "Luben",
      "Fabian"
    ],
    "group4": [
      "Bruno",
      "Sima",
      "Jens"
    ]
  },
  "proj7": {
    "group1": [
      "David",
      "Sima",
      "Sivak"
    ],
    "group2": [
      "Bruno",
      "Victor",
      "Fabian",
    ],
    "group3": [
      "Katrin",
      "Samin",
      "Jens",
      "Fi"
    ],
    "group4": [
      "Marina",
      "Luben",
      "Zan"
    ]
  }
}

// create an array with nodes
// console.log(gpdata.proj1);

const gpi = gpdata.proj1
const mates = [...gpi.group1, ...gpi.group2, ...gpi.group3, ...gpi.group4];

// // colors
const clrarr = []
mates.map((item, index) => {
  clrarr.push(`hsl(${index / 16 * 360}, 60%, 50%)`)
})

const font = {
  size: 15,
  color: "black"
  // face: "courier",
  // strokeWidth: 4,
  // strokeColor: "#ffffff",
}
// creating nodes
const x = []
mates.map((item, i) => x.push(
  {
    id: i,
    label: item,
    shape: 'circle',
    color: clrarr[i],
    font: font,
    // size: .1
  }
))
const nodes = new vis.DataSet(x);

console.log(gpdata);



// // to determine the frequency of connection
const projkeys = Object.keys(gpdata);
const reform = {}
mates.map((std, istd) => {
  const bb = {}
  mates.map((item) => { bb[item] = 0 })
  delete bb[std];
  reform[std] = bb
})



console.log('reform', reform);

projkeys.map((proji, i) => {
  const gpi = gpdata[proji];
  const gpkeys = Object.keys(gpi);
  gpkeys.map((key, j) => {
    const gparr = gpi[key];
    // console.log('gpar orig', gparr)
    gparr.map((bud, ibud) => {
      const gpsp = [...gparr]
      gpsp.splice(ibud, 1);
      gpsp.map((bd, ibd) => reform[bud][bd] += 1)
    })
  })
})
console.log('reform1', reform);

// // // removing 0 connnections and duplicates(undirected)
const nullremoved = { ...reform };
Object.keys(nullremoved).map((name1, iname1) => {
  const iobj = nullremoved[name1];
  Object.keys(iobj).map((name2, iname2) => {
    const src = mates.indexOf(name1);
    const tgt = mates.indexOf(name2);
    if (!iobj[name2]
      || src < tgt
    ) {
      // console.log('src, tgt', src,tgt);
      delete nullremoved[name1][name2]
    }
  })
})

console.log('nullremoved', nullremoved);

// // // removing half of the datasets (undirected graph)
console.log('null removed', nullremoved);
let edges = []
Object.keys(nullremoved).map((name1, iname1) => {
  const focus = nullremoved[name1]
  // console.log('focus', focus)
  const src = mates.indexOf(name1);
  Object.keys(focus).map((name2, iname2) => {
    const tgt = mates.indexOf(name2);
    edges.push(
      {
        from: src,
        to: tgt,
        value: focus[name2]
      }
    )
  })
})


// // // // }
console.log('edges', edges);
// // // console.log(edges)
const edgez = new vis.DataSet(edges);

// // create a network
const container = document.getElementById("visual");
const data = {
  nodes: nodes,
  edges: edgez,
};

const options = {
  physics: {
    stabilization: false,
    barnesHut: {
      springLength: 200,
    },
  }
}


let network = new vis.Network(container, data, options);