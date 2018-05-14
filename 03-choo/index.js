const choo = require('choo');
const html = require('choo/html');
const emoji = require('node-emoji');

const app = choo();

require('./assets/styles/global'); // css einbinden & sheetify



const styles = css`
  h1 {
    color: blue;
  }
`;

const wagon = 'railway_car';
const lok = 'steam_locomotive';

app.model({
  state: {
    loks:[ lok , lok , lok, lok ],
    wagons: [],
    gleis1: [],
    gleis2:[],
    selected: 'gleis1'
  },
  reducers: {
    // addWagon: (data, state) => ({ wagons: [...state.wagons, wagon] }),
    addWagon: (data, state) => {
      if (state.wagons.length < 10) {
        state.wagons.push(wagon);
      }
    },
    moveWagon1: (data, state) => {
      const add1 = [];
      if ((state.gleis1.length === 0) && (state.loks.length > 0)) {
        state.loks.pop();
        add1.push(lok);
      }

      if ((state.wagons.length > 0) && (state.gleis1.length < 5)){
        state.wagons.pop();
        add1.push(wagon);
      }

      return Object.assign(state, {
        loks: state.loks,
        wagons: state.wagons,
        gleis1: [...state.gleis1, ...add1]
      });
    },

    moveWagon2: (data, state) => {
      const add2 = [];
      if ((state.gleis2.length === 0) && (state.loks.length > 0)){
        state.loks.pop();
        add2.push(lok);
      }

      if ((state.wagons.length > 0) && (state.gleis2.length < 6)) {
        state.wagons.pop();
        add2.push(wagon);
      }

      return Object.assign(state, {
        wagons: state.wagons,
        gleis2: [...state.gleis2, ...add2]
      });
    },
    update: (data, state) =>
    {
      state.selected = data;
      return Object.assign(state, {
        selected: state.selected
      });
    },
    schedule: (data, state) => {
      const add = [];
      if ((state.selected === "gleis1") && (state.gleis1.length > 0)) {
        if (state.loks.length < 4) {
          state.loks.push(lok);
        }
        return Object.assign(state, {
          loks: state.loks,
          gleis1: []
        });
      }
      else if ((state.selected === "gleis2") && (state.gleis2.length > 0)) {
        if (state.loks.length < 4) {
          state.loks.push(lok);
        }
        return Object.assign(state, {
          loks: state.loks,
          gleis2: []
        });
      }
    }
  }
});

const mainView = (state, prev, send) => html`
  <main class=${styles}>
    <h1>Rangierbahnhof</h1>
    <hr>
    <button onclick=${() =>
      send('addWagon')} class="btn btn-primary">Wagen hinzufügen
    </button>
    <button onclick=${() =>
      send('moveWagon1')} class="btn btn-danger">auf Gleis 1
    </button>
    <button onclick=${() =>
      send('moveWagon2')} class="btn btn-danger">auf Gleis 2
    </button>

    <select id="choooose" onchange=${(e) => send('update', e.target.value)}>
      <option value="gleis1" ${ state.selected === 'gleis1' ? 'selected' : '' }>1. Gleis</option>
      <option value="gleis2" ${ state.selected === 'gleis2' ? 'selected' : '' }>2. Gleis</option>
    </select>
    <script>
    let choooosen = document.getElementById("choooose");
    let choooosen_val = choooosen.options[choooosen.selectedIndex].value;
    </script>
    <button onclick=${(e) => send('schedule', choooosen_val )} class="btn btn-danger">Schedule</button>

    <div class="gleis">
    <h2>Loks: ${state.loks.length}</h2>
      ${state.loks.map((v) => emoji.get(v))}
    </div>

    <div class="gleis">
    <h2>Verfügbar: ${state.wagons.length}</h2>
      ${state.wagons.map((v) => emoji.get(v))}
    </div>

    <div class="gleis">
    <h2>Gleis1: ${state.gleis1.length}</h2>
      ${state.gleis1.map((v) => emoji.get(v))}
    </div>

    <div class="gleis">
    <h2>Gleis2: ${state.gleis2.length}</h2>
      ${state.gleis2.map((v) => emoji.get(v))}
    </div>
  </main>
`;

app.router(route => [route('/', mainView)]);

const tree = app.start();
document.body.appendChild(tree);
