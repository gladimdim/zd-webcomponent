import {Element as PolymerElement} from '../node_modules/@polymer/polymer/polymer-element.js';
import * as sdk from '../node_modules/zoomdata-client/distribute/sdk/zoomdata-client.js';
import * as AggregationControl from './aggregationpickercontrol.js';

export class ZoomdataVisualization extends PolymerElement {
    static get template() {
        return `
        <style>
            .wrapper {
                display: grid;
                grid-template-columns: 2rem auto 2rem;
                grid-template-rows: 2rem auto 2rem;
                width: 100%;
                height: 100%;
            }
            .vis-content {
                grid-column-start: 2;
                grid-column-end: 2;
                grid-row-start: 2;
                grid-row-end: 2;
            }
            .vis-content-top {
                grid-column-start: 1;
                grid-column-end: 4;
                grid-row-start: 1;
                grid-row-end: 1;
                width: 100%;
                height: 100%;
            }
        </style>
        <div class="wrapper">
            <aggregation-picker-control id="controls" class="vis-content-top"></aggregation-picker-control>
            <div id="visContainer" class="vis-content" style="width: 100%; height: 100%"/>
        </div>
        `;
    }
    connectedCallback() {
        super.connectedCallback();
        initApp(this);
    }
    static get properties () {
        return {
            path: {
                type: String,
                reflectToAttribute: true
            },
            host: {
                type: String,
                reflectToAttribute: true
            },
            port: {
                type: Number,
                reflectToAttribute: true
            },
            key: {
                type: String,
                reflectToAttribute: true
            },
            secure: {
                type: Boolean,
                reflectToAttribute: true
            },
            sourceName: {
                type: String,
                reflectToAttribute: true
            },
            visualization: {
                type: String,
                reflectToAttribute: true
            },
            layout: {
                type: String,
                value: 'control-top'
            }
        };
    }
}
async function initializeClient(app) {
    const client = await ZoomdataSDK.createClient({
        credentials: {
            key: app.key
        },
        application: {
                secure: app.secure,
                host: app.host,
                port: app.port,
                path: app.path
        }
    });
    return client;
}

const visualize = async (component) => {
    const client = await initializeClient(component);
    const query = await client.createQuery(
        {name: component.sourceName},
        {
            groups: [
                {
                    'name': 'gender',
                    'limit': 50,
                    'sort': {
                        'dir': 'asc',
                        'name': 'gender'
                    }
                }
            ],
            metrics: [
                {
                    name: "satisfaction",
                    func: "sum"
                }
            ]
        }
    );
    const visualization = await client.visualize({
        element: component.$.visContainer,
        query: query,
        visualization: component.visualization,
        variables: {}
    });
    return visualization;
};


const initApp = async (component) => {
    const visualization = await visualize(component);
    visualization.query.validationErrors.subscribeOnNext((err) => {
        console.log(err);
    });
    const rootDom = component.$.controls;
    const metaData = visualization.metaThread.getLatestResponse();
    const aggrs = metaData.getAttrAggregations().filter((aggr) => {
        return aggr.getType() === "TERMS";
    });

    component.$.controls.currentAggregation = visualization.query.getAggregations(0)[0].field.name;
    component.$.controls.aggregations = aggrs;
    component.$.controls.addEventListener("selected", (e) => {
        const firstAggregation = visualization.query.getAggregations(0);
        firstAggregation[0].field.name = e.detail;
        visualization.query.setAggregation(0, 0, firstAggregation[0]);
    });
}

customElements.define("zoomdata-visualization", ZoomdataVisualization);
