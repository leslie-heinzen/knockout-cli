import * as ko from 'knockout';
import './app.css';
// @ts-ignore
import template from './app.html';
import viewModel from './app';

ko.components.register('app', { template, viewModel });