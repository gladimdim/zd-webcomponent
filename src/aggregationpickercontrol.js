import {Element as PolymerElement} from '../node_modules/@polymer/polymer/polymer-element.js';

class AggregationPickerControl extends PolymerElement {
    static get template() {
        return `
            <div id="aggregations">
            </div>
        `;
    }
    constructor() {
        super();
    }
    static get properties() {
        return {
            aggregations: {
                observer: "aggregationsSet",
                Type: Array
            },
            currentAggregation: {
                Type: String
            }
        };
    }
    aggregationsSet(aggrs) {
        const aggrNames = aggrs.map((aggr) => aggr.getName());
        const rootElement = document.createElement("select");
        rootElement.setAttribute("name", "aggregations");
        for (let name of aggrNames) {
            const optionElement = document.createElement("option");
            if (this.currentAggregation === name) {
                optionElement.setAttribute("selected", "selected");
            }
            optionElement.textContent = name;
            rootElement.appendChild(
                optionElement
            );
        }
        this.$.aggregations.innerHTML = '';
        this.$.aggregations.appendChild(rootElement);
        rootElement.addEventListener("change", (newValue) => {
            this.dispatchEvent(new CustomEvent("selected", {detail: newValue.target.value}));
        });
    }
}

customElements.define("aggregation-picker-control", AggregationPickerControl);
