/* eslint-disable */

var style = [
  {
    selector: "core",
    style: {
      "selection-box-color": "#AAD8FF",
      "selection-box-border-color": "#8BB0D0",
      "selection-box-opacity": "0.5",
    },
  },
  {
    selector: "node",
    style: {
      width: "mapData(score, 0, 0.006769776522008331, 20, 60)",
      height: "mapData(score, 0, 0.006769776522008331, 20, 60)",
      content: "data(name)",
      "font-size": "12px",
      "text-valign": "center",
      "text-halign": "center",
      "background-color": "#555",
      "text-outline-color": "#555",
      "text-outline-width": "2px",
      color: "#fff",
      "overlay-padding": "6px",
      "z-index": "10",
    },
  },
  {
    selector: "node[?attr]",
    style: {
      shape: "rectangle",
      "background-color": "#aaa",
      "text-outline-color": "#aaa",
      width: "16px",
      height: "16px",
      "font-size": "6px",
      "z-index": "1",
    },
  },
  {
    selector: "node[?query]",
    style: {
      "background-clip": "none",
      "background-fit": "contain",
    },
  },
  {
    selector: "node:selected",
    style: {
      "border-width": "6px",
      "border-color": "#AAD8FF",
      "border-opacity": "0.5",
      "background-color": "#77828C",
      "text-outline-color": "#77828C",
    },
  },
  {
    selector: "edge",
    style: {
      "curve-style": "haystack",
      "haystack-radius": "0.5",
      opacity: "0.4",
      "line-color": "#bbb",
      width: "mapData(weight, 0, 1, 1, 8)",
      "overlay-padding": "3px",
    },
  },
  {
    selector: "node.unhighlighted",
    style: {
      opacity: "0.2",
    },
  },
  {
    selector: "edge.unhighlighted",
    style: {
      opacity: "0.05",
    },
  },
  {
    selector: ".highlighted",
    style: {
      "z-index": "999999",
    },
  },
  {
    selector: "node.highlighted",
    style: {
      "border-width": "6px",
      "border-color": "#AAD8FF",
      "border-opacity": "0.5",
      "background-color": "#394855",
      "text-outline-color": "#394855",
    },
  },
  {
    selector: "edge.filtered",
    style: {
      opacity: "0",
    },
  },
  {
    selector: 'edge[group="coexp"]',
    style: {
      "line-color": "#d0b7d5",
    },
  },
  {
    selector: 'edge[group="coloc"]',
    style: {
      "line-color": "#a0b3dc",
    },
  },
  {
    selector: 'edge[group="gi"]',
    style: {
      "line-color": "#90e190",
    },
  },
  {
    selector: 'edge[group="path"]',
    style: {
      "line-color": "#9bd8de",
    },
  },
  {
    selector: 'edge[group="pi"]',
    style: {
      "line-color": "#eaa2a2",
    },
  },
  {
    selector: 'edge[group="predict"]',
    style: {
      "line-color": "#f6c384",
    },
  },
  {
    selector: 'edge[group="spd"]',
    style: {
      "line-color": "#dad4a2",
    },
  },
  {
    selector: 'edge[group="spd_attr"]',
    style: {
      "line-color": "#D0D0D0",
    },
  },
  {
    selector: 'edge[group="reg"]',
    style: {
      "line-color": "#D0D0D0",
    },
  },
  {
    selector: 'edge[group="reg_attr"]',
    style: {
      "line-color": "#D0D0D0",
    },
  },
  {
    selector: 'edge[group="user"]',
    style: {
      "line-color": "#f0ec86",
    },
  },
];

Promise.all([
  fetch(localStorage.getItem("terminal") + "/graph").then(function (res) {
    return res.json();
  }),
  ,
]).then(function (dataArray) {
  const datas = [];
  const data = dataArray[0];

  const mapNucGraphToCy = (data) => {
    Object.keys(data).forEach((item) => {
      switch (data[item].type) {
        case "CLASS":
          {
            datas.push({
              data: {
                id: data[item].id,
                name: item,
              },
              group: "nodes",
            });
            data[item]?.instances?.forEach((a) => {
              datas.push({
                data: {
                  source: a,
                  target: data[item].id,
                  weight: 2,
                },
                position: {},
                group: "edges",
              });
            });
          }
          break;
        case "OBJECT":
          {
            datas.push({
              data: {
                id: data[item].id,
                name: item,
              },
              group: "nodes",
            });
          }
          break;
        case "PROPERTY":
          {
            datas.push({
              data: {
                id: data[item].id,
                name: item,
              },
              group: "nodes",
            });

            datas.push({
              data: {
                source: data[item].id,
                target: data[item].object,
                weight: 2,
              },
              position: {},
              group: "edges",
            });
          }
          break;
      }
    });
  };

  mapNucGraphToCy(data);

  var h = function (tag, attrs, children) {
    var el = document.createElement(tag);

    Object.keys(attrs).forEach(function (key) {
      var val = attrs[key];

      el.setAttribute(key, val);
    });

    children.forEach(function (child) {
      el.appendChild(child);
    });

    return el;
  };

  var t = function (text) {
    var el = document.createTextNode(text);

    return el;
  };

  var $ = document.querySelector.bind(document);

  var cy = (window.cy = cytoscape({
    container: document.getElementById("cy"),
    style: style,
    elements: datas,
    layout: { name: "random" },
  }));

  var params = {
    name: "cola",
    nodeSpacing: 5,
    edgeLengthVal: 107,
    flow: { axis: "y", minSeparation: 30 },
    animate: true,
    randomize: true,
    maxSimulationTime: 1500,
  };

  var layout = makeLayout();

  layout.run();

  var $btnParam = h(
    "div",
    {
      class: "param",
    },
    []
  );

  var $config = $("#config");

  $config.appendChild($btnParam);

  var sliders = [
    {
      label: "Edge length",
      param: "edgeLengthVal",
      min: 1,
      max: 200,
    },

    {
      label: "Node spacing",
      param: "nodeSpacing",
      min: 1,
      max: 50,
    },
  ];

  var buttons = [
    {
      label: h("span", { class: "fa fa-random" }, []),
      layoutOpts: {
        randomize: true,
        flow: null,
      },
    },

    {
      label: h("span", { class: "fa fa-long-arrow-down" }, []),
      layoutOpts: {
        flow: { axis: "y", minSeparation: 30 },
      },
    },
  ];

  sliders.forEach(makeSlider);

  buttons.forEach(makeButton);

  function makeLayout(opts) {
    params.randomize = false;
    params.edgeLength = function (e) {
      return params.edgeLengthVal / e.data("weight");
    };

    for (var i in opts) {
      params[i] = opts[i];
    }

    return cy.layout(params);
  }

  function makeSlider(opts) {
    var $input = h(
      "input",
      {
        id: "slider-" + opts.param,
        type: "range",
        min: opts.min,
        max: opts.max,
        step: 1,
        value: params[opts.param],
        class: "slider",
      },
      []
    );

    var $param = h("div", { class: "param" }, []);

    var $label = h(
      "label",
      { class: "label label-default", for: "slider-" + opts.param },
      [t(opts.label)]
    );

    $param.appendChild($label);
    $param.appendChild($input);

    $config.appendChild($param);

    var update = _.throttle(function () {
      params[opts.param] = $input.value;

      layout.stop();
      layout = makeLayout();
      layout.run();
    }, 1000 / 30);
    cy.resize();
    $input.addEventListener("input", update);
    $input.addEventListener("change", update);
  }

  function makeButton(opts) {
    var $button = h("button", { class: "btn btn-default" }, [opts.label]);

    $btnParam.appendChild($button);

    $button.addEventListener("click", function () {
      layout.stop();

      if (opts.fn) {
        opts.fn();
      }
      console.log(opts);
      layout = makeLayout(opts.layoutOpts);
      layout.run();
    });
  }

  var makeTippy = function (node, html) {
    return tippy(node.popperRef(), {
      html: html,
      trigger: "manual",
      arrow: true,
      placement: "bottom",
      hideOnClick: false,
      interactive: true,
    }).tooltips[0];
  };

  var hideTippy = function (node) {
    var tippy = node.data("tippy");

    if (tippy != null) {
      tippy.hide();
    }
  };

  var hideAllTippies = function () {
    cy.nodes().forEach(hideTippy);
  };

  cy.on("tap", function (e) {
    if (e.target === cy) {
      hideAllTippies();
    }
  });

  cy.on("tap", "edge", function (e) {
    hideAllTippies();
  });

  cy.on("zoom pan", function (e) {
    hideAllTippies();
  });

  $("#config-toggle").addEventListener("click", function () {
    $("body").classList.toggle("config-closed");

    cy.resize();
  });
});

/* eslint-enable */
