
import { gpdata } from "./grouping.js"


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
console.log('edges', edges.length);
// // // console.log(edges)
const edgez = new vis.DataSet(edges);

// // create a network
const container = document.getElementById("mynetwork");
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