import * as d3 from "d3";
import { Plot, LayerDefinition, LayerMap } from "./plot";
import { DataEntry, Config, Feature } from "./const";

export default abstract class AbstractPlot implements Plot {

  readonly canvas: d3.Selection<SVGGElement>;

  margin = {
    top: 110,
    right: 75,
    bottom: 75,
    left: 75
  }
  private _canvasWidth: number;
  private _canvasHeight: number;

  protected _data: DataEntry[];
  protected _options: Config;

  readonly layerMap: LayerMap;
  readonly defaultLayer: d3.Selection<SVGGElement>;
  private drawnFeatures: Feature[];

  readonly svg: d3.Selection<SVGSVGElement>;
  readonly displayContainer: d3.Selection<SVGGElement>;
  readonly titleLabel: d3.Selection<SVGElement>;
  readonly background: d3.Selection<SVGGElement>;
  readonly border: d3.Selection<SVGGElement>;

  // readonly dataLayer: d3.Selection<SVGGElement>;
  // readonly featureLayer: d3.Selection<SVGGElement>;

  javaBridge: any | null;

  constructor(readonly root: HTMLDivElement, data: DataEntry[], options: Config, layers?: LayerDefinition) {
    this._data = data;
    this._options = options;

    // Create plot containers
    const { width, height } = this.root.getBoundingClientRect();
    this._canvasWidth = Math.max(0, width - (this.margin.left + this.margin.right));
    this._canvasHeight = Math.max(0, height - (this.margin.top + this.margin.bottom));

    this.svg = d3
      .select(root)
      .append("svg")
      .attr("id", "plot1");

    this.displayContainer = this.svg
      .append("g")
      .attr("id", "displayContainer")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.titleLabel = this.displayContainer
      .append("text")
      .attr("class", "title-text")
      .attr("font-family", "sans-serif")
      .attr("font-size", "24px")
      .attr("y", -60);

    this.canvas = this.displayContainer
      .append("g")
      .attr("clip-path", "url(#plotClipBox)");

    this.layerMap = layers ? constructLayerMap(this.canvas, layers) : {};

    this.defaultLayer = this.canvas.insert("g", ":first-child")
      .attr("class", "default-layer");

    this.background = this.canvas
      .insert("rect", ":first-child")
      .attr("id", "background")
      .attr("fill", "white");

    this.displayContainer
      .append("defs")
      .append("clipPath")
      .attr("id", "plotClipBox")
      .append("use")
      .attr("xlink:href", "#" + this.background.attr("id"));

    this.border = this.displayContainer
      .append("rect")
      .attr("id", "plot-border")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", "2px");

    this.drawnFeatures = [];
  }

  get data() {
    return this._data;
  }

  set data(data: DataEntry[]) {
    this._data = data;
    this.update();
  }

  setDataFromJSON(data: string) {
    this.data = JSON.parse(data);
  }

  get options() {
    return this._options;
  }

  set options(options: Config) {
    this._options = options;
    this.update();
  }

  setOptionsFromJSON(options: string) {
    this.options = JSON.parse(options);
  }

  get canvasWidth() {
    return this._canvasWidth;
  }

  get canvasHeight() {
    return this._canvasHeight;
  }

  protected resize(): void {
    const { width, height } = this.root.getBoundingClientRect();
    this._canvasWidth = Math.max(0, width - (this.margin.left + this.margin.right));
    this._canvasHeight = Math.max(0, height - (this.margin.top + this.margin.bottom));

    this.svg
      .attr("width", width)
      .attr("height", height);
    this.background
      .attr("width", this._canvasWidth)
      .attr("height", this._canvasHeight);
    this.border
      .attr("width", this._canvasWidth)
      .attr("height", this._canvasHeight);

    this.titleLabel
      .text(this._options.title)
      .attr(
        "x",
        this._canvasWidth / 2 - (this.titleLabel.node() as SVGElement).getBoundingClientRect().width / 2
      );
  }

  abstract update(): void;

}

function constructLayerMap(parent: d3.Selection<SVGGElement>, layers: LayerDefinition): LayerMap  {
  if (!parent) throw Error("A parent selection must be provided.");
  if (!layers) return {};

  const layerMap: { [key in Feature]?: d3.Selection<SVGGElement> } = {};
  layers.forEach(part => {
    const newLayer = parent.insert("g", ":first-child");
    if (part instanceof Array) {
      newLayer.attr("class", "layer-group")
      Object.assign(layerMap, constructLayerMap(newLayer, part));
    } else {
      newLayer.attr("class", part + "-layer")
      layerMap[part] = newLayer;
    }
  });
  return layerMap;
}