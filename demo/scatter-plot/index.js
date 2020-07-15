
function makePlot() {
  const { LABEL, SELECTED, VISIBLE, X, SIGMA_X, Y, SIGMA_Y, RHO } = topsoil.Variable;
  const {
    TITLE,
    X_AXIS,
    Y_AXIS,
    ISOTOPE_SYSTEM,
    UNCERTAINTY,
    POINTS,
    POINTS_FILL,
    ELLIPSES,
    ELLIPSES_FILL,
    CONCORDIA_TYPE,
    CONCORDIA_LINE,
    CONCORDIA_ENVELOPE,
    ERROR_BARS,
  } = topsoil.Option;
  const data = [
    { [LABEL]: "row1", [SELECTED]: true, [VISIBLE]: false, [X]: "27.9", [SIGMA_X]: "1.3", [Y]: "0.71", [SIGMA_Y]: "0.02", [RHO]: "0.89" }
  ];
  
  const options = {
    [TITLE]: "Scatter Plot Demo",
    [X_AXIS]: "X Axis Title",
    [Y_AXIS]: "Y Axis Title",
    [ISOTOPE_SYSTEM]: "Uranium Lead",
    [UNCERTAINTY]: 1,
    [POINTS]: true,
    [POINTS_FILL]: "#4682b4",
    [ELLIPSES]: false,
    [ELLIPSES_FILL]: "#ff0000",
    [CONCORDIA_TYPE]: "wetherill",
    [CONCORDIA_LINE]: true,
    [CONCORDIA_ENVELOPE]: true,
    [ERROR_BARS]: true,
  }

  const Feature = topsoil.Feature;
  const layers = [
    Feature.POINTS, 
    [ Feature.ELLIPSES, Feature.ERROR_BARS ], 
    [ Feature.CONCORDIA, Feature.EVOLUTION ],
  ];

  return new topsoil.ScatterPlot(
    document.getElementById("scatter-plot"),
    data,
    options,
    layers
  );
}

const plot = makePlot();
Object.values(topsoil.Option).forEach(option => {
  const element = document.getElementById(option);
  if (element) {
    if (element.type === "checkbox") element.checked = plot.options[option];
    else element.value = plot.options[option];
  }
});

const SPLIT_SIZES_KEY = "topsoil-js_SCATTER-PLOT-DEMO_split-sizes";

const sizes = sessionStorage.getItem(SPLIT_SIZES_KEY);
const split = Split(["#scatter-plot", "#options-panel"], {
  direction: "horizontal",
  sizes: sizes ? JSON.parse(sizes) : [70, 30],
  minSize: [0, 350],
  onDrag: (_) => plot.resize(),
  onDragEnd: (sizes) => {
    sessionStorage.setItem(SPLIT_SIZES_KEY, JSON.stringify(sizes));
  },
});
window.addEventListener("resize", () => plot.resize());
plot.resize();

function setOption(event) {
  const control = event.target;
  const option = topsoil.Option[control.name.toUpperCase()];
  plot.options = Object.assign(plot.options, { [option]: control.value });
}
