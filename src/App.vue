<template>
  <div id="app">
    <b-modal
      title="Configurar scraper"
      ref="config"
      id="config"
      size="lg"
      @ok="save"
      @show="open()"
      @hide="close()"
    >
      <b-card>
        <b-card-text>
          <b-row>
            <b-col sm="12">
              <b-form-group label="Status:">
                <b-form-radio-group
                  id="btn-radios-1"
                  v-model="config.status"
                  :options="[
                    { text: 'Activo', value: 'Activo' },
                    { text: 'Inactivo', value: 'Inactivo' }
                  ]"
                  buttons
                  button-variant="outline-primary"
                ></b-form-radio-group>
              </b-form-group>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="2" class>
              <p>Zonas:</p>
            </b-col>
            <b-col md="3" class="ml-auto">
              <b-button @click.prevent="showEdit()">Crear zona</b-button>
            </b-col>
          </b-row>
          <b-list-group class="mt-3">
            <b-list-group-item
              class="d-flex justify-content-between align-items-center"
              v-for="(item, index) in config.zones"
              v-bind:key="index"
            >
              <div>
                <b-form-group>
                  <b-form-checkbox v-model="item.status" value="true">
                    {{ item.name }} ({{ item.zipcode.split("\n").length }}
                    zipcodes)
                  </b-form-checkbox>
                </b-form-group>
              </div>
              <div>
                <b-button @click="showEdit(item)">Editar</b-button>
                <b-button @click="deleteItem(item)" variant="danger">Eliminar</b-button>
              </div>
            </b-list-group-item>
          </b-list-group>
        </b-card-text>
      </b-card>
    </b-modal>

    <b-modal
      :title="editedIndex == -1 ? 'Nueva zona' : 'Editar zona'"
      size="xl"
      ref="edit"
      id="edit"
    >
      <template v-if="editedItem">
        <b-row class="mb-3">
          <b-col sm="9">
            <b-form-label for="zipcode">Nombre:</b-form-label>
            <b-form-input class="mt-2" v-model="editedItem.name" placeholder="Nombre"></b-form-input>
          </b-col>
          <b-col sm="3">
            <b-form-group label="Status:">
              <b-form-radio-group
                id="btn-radios-1"
                v-model="editedItem.status"
                :options="[
                  { text: 'Activo', value: true },
                  { text: 'Inactivo', value: ' ' }
                ]"
                buttons
                :button-variant="editedItem.status === 'Activo' ? 'outline-success' : 'outline-primary'"
              ></b-form-radio-group>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col sm="12">
            <b-form-label for="zipcode">Zipcodes:</b-form-label>
            <b-form-textarea
              id="zipcode"
              v-model="editedItem.zipcode"
              placeholder="Zipcodes"
              rows="3"
              class="mt-1"
              maax-rows="6"
            ></b-form-textarea>
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col sm="12">
            <b-form-label for="zipcode">Fechas de activacion:</b-form-label>
            <v-date-picker mode="multiple" :min-date="new Date()" v-model="editedItem.dates">
              <b-button>Almanaque</b-button>
            </v-date-picker>
          </b-col>
        </b-row>

        <b-row class="mt-3">
          <b-col sm="6">
            <b-form-label for="zipcode">Hora de inicio:</b-form-label>
            <b-form-input type="time" v-model="editedItem.timeStart" placeholder="Hora de inicio"></b-form-input>
          </b-col>
          <b-col sm="6">
            <b-form-label for="zipcode">Hora de fin:</b-form-label>
            <b-form-input type="time" v-model="editedItem.timeEnd" placeholder="Hora de fin"></b-form-input>
          </b-col>
        </b-row>
      </template>

      <b-row class="mt-3">
        <b-col sm="12">
          <b-form-label for="appliance">
            Appliance ({{
            editedItem.appliance ? editedItem.appliance.split("\n").length : ""
            }}):
          </b-form-label>
          <b-form-textarea
            id="appliance"
            v-model="editedItem.appliance"
            placeholder="Appliance"
            rows="3"
            class="mt-1"
            maax-rows="6"
          ></b-form-textarea>
        </b-col>
      </b-row>

      <b-row class="mt-3">
        <b-col sm="12">
          <b-form-label for="brand" v-if="editedItem.brand">
            Brands ({{
            editedItem.brand
            ? editedItem.brand.split("\n").length
            : ""
            }}
            ):
          </b-form-label>
          <b-form-textarea
            id="brand"
            v-model="editedItem.brand"
            placeholder="Brand"
            rows="3"
            class="mt-1"
            maax-rows="6"
          ></b-form-textarea>
        </b-col>
      </b-row>

      
      <b-row class="mt-3">
        <b-col sm="12">
          <b-form-label for="symptom" v-if="editedItem.symptom">
            Symptoms ({{
            editedItem.symptom
            ? editedItem.symptom.split("\n").length
            : ""
            }}
            ):
          </b-form-label>
          <b-form-textarea
            id="symptom"
            v-model="editedItem.symptom"
            placeholder="symptom"
            rows="3"
            class="mt-1"
            maax-rows="6"
          ></b-form-textarea>
        </b-col>
      </b-row>

      <div slot="modal-footer" class="w-100">
        <b-button
          variant="primary"
          size="sm"
          :class="editedIndex != -1 ? 'float-right' : ''"
          @click="$refs['edit'].hide()"
        >Cerrar</b-button>

        <b-button
          size="sm"
          class="ml-3 float-right"
          :disabled="loading"
          @click="
            saveEdit();
            $refs['edit'].hide();
          "
          v-if="editedIndex == -1"
        >Guardar</b-button>
      </div>
    </b-modal>

    <b-card>
      <b-row class="mt-2">
        <b-button variant="primary" @click="openConfig">Configurar Scraper</b-button>
      </b-row>
      <b-row>
        <h1 class="text-center">Historial</h1>
      </b-row>
      <b-row class="mt-10">
        <History></History>
      </b-row>
    </b-card>
  </div>
</template>

<script>
import History from "./components/History";
import axios from "axios";
export default {
  name: "app",
  components: {
    History,
  },
  data() {
    return {
      loading: false,
      config: {
        appliance: "",
        zones: [],
        status: "Inactivo",
      },
      events: [],
      saved: false,
      editedIndex: null,
      editedItem: {
        dates: [],
      },
    };
  },
  methods: {
    open() {
      const left = document.querySelector("#left-divider");
      if (left) {
        left.style.display = "none";
      }
    },
    close() {
      const left = document.querySelector("#left-divider");
      if (left) {
        left.style.display = "block";
      }
    },
    initialize() {
      // let config = axios.get(`/config`).then(config => {
      //   this.config = config.data.config;
      // }).catch(error => {
      //     this.$noty.error("Error al leer configuración")
      // });
    },

    openConfig() {
      let config = axios
        .get(`/config`)
        .then((config) => {
          this.config = config.data.config;
          this.$refs["config"].show();
        })
        .catch((error) => {
          this.$noty.error("Error al leer configuración");
        });
    },

    deleteItem(zone) {
      const index = this.config.zones.indexOf(zone);
      this.$delete(this.config.zones, index);
    },
    save(event) {
      event.preventDefault();
      //localStorage.setItem('config', JSON.stringify(this.config))
      //console.log(JSON.parse(localStorage.getItem('config')))
      const { config } = this;
      this.loading = true;

      const res = axios
        .post(`/config`, { data: config })
        .then(() => {
          this.$noty.info("Configuración guardada");
          this.$refs["config"].hide();
        })
        .catch((error) => {
          this.$noty.error("Error al guardar configuración");
        })
        .finally(() => {
          this.initialize();
          this.loading = false;
        });
    },
    showEdit(zone) {
      console.log("zone", zone);
      if (zone) {
        this.editedIndex = this.config.zones.indexOf(zone);
        if (zone.dates) {
          zone.dates = zone.dates.map((date) => {
            return new Date(date);
          });
        }
        this.editedItem = Object.assign(zone, {});
      } else {
        this.editedIndex = -1;
        this.editedItem = {};
      }
      // JSON.parse(JSON.stringify(zone || {}))

      this.$refs["edit"].show();
    },
    saveEdit() {
      if (this.editedIndex == -1) {
        if (!this.config.zones) {
          this.config.zones = [];
        }
        this.config.zones.push(this.editedItem);
      } else {
        this.config.zones.splice(this.editedIndex, 1, this.editedItem);
      }
      console.log(this.config);
    },
  },
  mounted() {
    this.initialize();
  },
  computed: {
    inputState() {
      if (!this.selectedValue) {
        return {
          type: "is-danger",
          message: "Date required.",
        };
      }
      return {
        type: "is-primary",
        message: "",
      };
    },
  },
};
</script>
