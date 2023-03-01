/* eslint-disable */

const style = [
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
      content: "data(label)",
      "font-size": "10px",
      "font-family": "monospace",
      "text-valign": "bottom",
      "text-halign": "center",
      "background-color": "#2c3a40",
      color: "#363636",
      "overlay-padding": "12px",
      "z-index": "10",
      "text-wrap": "wrap",
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
      "line-color": "#6c6c6c",
      width: "2px",
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
  fetch(localStorage.getItem("terminal") + "/graph").then((res) => res.json()),
]).then(function (dataArray) {
  const graph = [];
  const data = dataArray[0];

  const mapNucGraphToCy = (data) => {
    Object.keys(data).forEach((prop) => {
      const node = data[prop];

      if (!node.id || node.type === "IF") {
        return;
      }

      graph.push({
        data: {
          id: node.id,
          label: `\n${prop}\n[${node.type.toLowerCase()}]`,
        },
        group: "nodes",
      });
    });

    Object.keys(data).forEach((prop) => {
      const node = data[prop];

      if (!node.id) {
        return;
      }

      for (const property in node) {
        if (property === "id" && property === "type") {
          continue;
        }

        if (Array.isArray(node[property])) {
          node[property].forEach((item) => {
            if (
              graph.find((g) => g.group === "nodes" && g.data.id === item) &&
              !graph.find(
                (g) =>
                  (g.group === "edges" &&
                    g.data.source === node.id &&
                    g.data.target === item) ||
                  (g.data.source === item && g.data.target === node.id)
              )
            ) {
              graph.push({
                data: {
                  source: node.id,
                  target: item,
                  weight: 2,
                },
                position: {},
                group: "edges",
              });
            }
          });
        } else {
          if (
            graph.find(
              (g) => g.group === "nodes" && g.data.id === node[property]
            ) &&
            !graph.find(
              (g) =>
                (g.group === "edges" &&
                  g.data.source === node.id &&
                  g.data.target === node[property]) ||
                (g.data.source === node[property] && g.data.target === node.id)
            )
          ) {
            graph.push({
              data: {
                source: node.id,
                target: node[property],
                weight: 2,
              },
              position: {},
              group: "edges",
            });
          }
        }
      }
    });
  };

  mapNucGraphToCy(data);

  const h = function (tag, attrs, children) {
    const el = document.createElement(tag);

    Object.keys(attrs).forEach(function (key) {
      const val = attrs[key];

      el.setAttribute(key, val);
    });

    children.forEach(function (child) {
      el.appendChild(child);
    });

    return el;
  };

  const t = function (text) {
    const el = document.createTextNode(text);

    return el;
  };

  const $ = document.querySelector.bind(document);

  const cy = (window.cy = cytoscape({
    container: document.getElementById("cy"),
    style: style,
    elements: graph,
    wheelSensitivity: 0.1,
  }));

  const params = {
    name: "cola",
    nodeSpacing: 10,
    edgeLengthVal: 150,
    ready: () => cy.center(),
    flow: { axis: "y", minSeparation: 30 },
    animate: true,
    maxSimulationTime: 1000,
    fit: cy.nodes().length > 10,
  };

  let layout = makeLayout();

  layout.run();

  const $btnParam = h(
    "div",
    {
      class: "param",
    },
    []
  );

  const $config = $("#config");

  $config.appendChild($btnParam);

  const sliders = [
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

  const buttons = [
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
    params.edgeLength = function (e) {
      return params.edgeLengthVal / e.data("weight");
    };

    for (const i in opts) {
      params[i] = opts[i];
    }

    return cy.layout(params);
  }

  function makeSlider(opts) {
    const $input = h(
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

    const $param = h("div", { class: "param" }, []);

    const $label = h(
      "label",
      { class: "label label-default", for: "slider-" + opts.param },
      [t(opts.label)]
    );

    $param.appendChild($label);
    $param.appendChild($input);

    $config.appendChild($param);

    const update = _.throttle(function () {
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
    const $button = h("button", { class: "btn btn-default" }, [opts.label]);

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

  const makeTippy = function (node, html) {
    return tippy(node.popperRef(), {
      html: html,
      trigger: "manual",
      arrow: true,
      placement: "bottom",
      hideOnClick: false,
      interactive: true,
    }).tooltips[0];
  };

  const hideTippy = function (node) {
    const tippy = node.data("tippy");

    if (tippy != null) {
      tippy.hide();
    }
  };

  const hideAllTippies = function () {
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
