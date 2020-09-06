import * as ko from "knockout";
import "./about.css";
// @ts-ignore
import template from "./about.html";
import viewModel from "./about";

ko.components.register("about", { template, viewModel });
