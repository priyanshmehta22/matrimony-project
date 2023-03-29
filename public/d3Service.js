// const d3 = require("d3");

const d3Func = async () => {
  console.log("asdfasdf");
  // set a width and height for our SVG
  var width = window.innerWidth,
    height = window.innerHeight;
  const graphData = await fetch("http://localhost:3000/user/graph-data", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(await graphData.json());
  // setup links
  arrobj = [];
  for (let i = 0; i < 400; i++) {
    // const element = array[i];
    arrobj.push({ id: i });
  }
  // for()
  var links = [];
  for (let i = 0; i < 200; i++) {
    links.push({ source: "MIH", target: "" + arrobj[i].id });
  }

  for (let i = 200; i < 400; i++) {
    links.push({ source: "BIH", target: "" + arrobj[i].id });
  }
  // for (let i = 0; i < 20; i++) {
  //     links.push({ source: '1', target: '' + arrobj[10 + i].id });
  // }
  links.push({ source: "1", target: "" + arrobj[203].id });
  links.push({ source: "1", target: "" + arrobj[204].id });
  links.push({ source: "1", target: "" + arrobj[207].id });
  links.push({ source: "1", target: "" + arrobj[310].id });
  links.push({ source: "20", target: "" + arrobj[320].id });
  links.push({ source: "20", target: "" + arrobj[330].id });
  links.push({ source: "20", target: "" + arrobj[340].id });
  links.push({ source: "20", target: "" + arrobj[350].id });
  links.push({ source: "50", target: "" + arrobj[250].id });
  links.push({ source: "50", target: "" + arrobj[367].id });
  links.push({ source: "50", target: "" + arrobj[290].id });
  links.push({ source: "50", target: "" + arrobj[352].id });

  // create empty nodes array
  var nodes = [];

  // compute nodes from links data
  links.forEach(function (link) {
    link.source =
      nodes[link.source] || (nodes[link.source] = { name: link.source });
    link.target =
      nodes[link.target] || (nodes[link.target] = { name: link.target });
  });
  // nodes.push(12);
  // nodes.push(13);
  // add a SVG to the body for our viz
  var svg = d3
    .select("#mysvg")
    .append("svg")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("width", width)
    .attr("height", height)
    .call(
      d3.behavior.zoom().on("zoom", function () {
        svg.attr(
          "transform",
          "translate(" +
            d3.event.translate +
            ")" +
            " scale(" +
            d3.event.scale +
            ")"
        );
      })
    )
    .append("g");

  var force = d3.layout
    .force()
    .size([width, height])
    .nodes(d3.values(nodes))
    .links(links)
    .on("tick", tick)
    .linkDistance(100)
    .charge(-600)
    .start();

  // add links
  var link = svg
    .selectAll(".link")
    .data(links)
    .enter()
    .append("line")
    .attr("class", "link");

  // add nodes
  var node = svg
    .selectAll(".nodeg")
    // .select('.nodeb')
    .data(force.nodes())
    .enter()
    .append("circle")
    .attr("class", "nodeg")
    // .attr('class','nodeb')
    .attr("r", width * 0.01);
  var node1 = svg
    .selectAll(".nodeb")
    // .select('.nodeb')
    .data(force.nodes())
    .enter()
    .append("circle")
    .attr("class", "nodeb")
    .attr("class", "nodeb")
    .attr("r", width * 0.01);

  // what to do
  function tick(e) {
    node
      .attr("cx", function (d) {
        return d.x;
      })
      .attr("cy", function (d) {
        return d.y;
      })
      .call(force.drag);

    link
      .attr("x1", function (d) {
        return d.source.x;
      })
      .attr("y1", function (d) {
        return d.source.y;
      })
      .attr("x2", function (d) {
        return d.target.x;
      })
      .attr("y2", function (d) {
        return d.target.y;
      });
  }
};

d3Func();
