<template>
  <div id="app">

      <b-button v-b-modal.config>Configurar Scraper</b-button>

      <b-modal 
       title="Configurar scraper"
       ref="config"
       id="config"
       size="lg"
       @ok="save"
       @show="open()"
       @hide="close()"
       >
        <b-card
        >

          <b-card-text>
            <b-row>
              <b-col sm="12">
                <b-form-group label="Status:">
                  <b-form-radio-group
                    id="btn-radios-1"
                    v-model="config.status"
                    :options="[{text: 'Activo', value: 'Activo'}, {text: 'Inactivo', value: 'Inactivo'}]"
                    buttons
                    button-variant="outline-primary"
                  ></b-form-radio-group>
                </b-form-group>
              </b-col>
            </b-row>

            <b-row>
              <b-col sm="12">
                <b-form-group label="Intervalo:">
                  <b-form-input
                    v-model="config.interval"
                    type="number"
                    placeholder="Intervalo en segundos"
                  > 

                  </b-form-input>
                </b-form-group>
              </b-col>
            </b-row>

            <b-row>
              
                <b-col md="2" class=" "><p>Zonas:</p></b-col>
                <b-col md="3" class="ml-auto ">
                  <b-button @click.prevent="showEdit()">Crear zona</b-button>
                </b-col>
                
              </b-row>
              <b-list-group class="mt-3">
                <b-list-group-item 
                class="d-flex justify-content-between align-items-center"
                v-for="(item,index) in config.zones" v-bind:key="index">
                 

                    <div>
                      <b-form-group>
                        
                        <b-form-checkbox
                        v-model="item.status"
                        value="true"
                        
                      >
                        {{ item.name }} ({{item.zipcode.split('\n').length}} zipcodes) 
                       </b-form-checkbox> 

                        </b-form-group> 
                    </div> 
                  <div>
                    

                     
                    <b-button @click="showEdit(item)">Editar</b-button>
                    <b-button @click="deleteItem(item)" variant="danger">Eliminar</b-button>

                  </div>

                </b-list-group-item>
              </b-list-group>



              <b-row class="mt-3">
                 <b-col sm="3">
                    <label for="appliance" >Appliance ({{config.appliance ? config.appliance.split('\n').length : ''}}):</label>
                 </b-col> 
                 <b-col sm="9">
                    <b-form-textarea
                      id="appliance"
                      v-model="config.appliance"
                      placeholder="Appliance"
                      rows="3"
                      maax-rows="6"
                    ></b-form-textarea>
                 </b-col>
              </b-row>

              <b-row class="mt-3">
                 <b-col sm="3">
                    <label for="appliance" v-if="config.paymentMethod">Métodos de pago ({{config.paymentMethod ? config.paymentMethod.split('\n').length : ''}} ):</label>
                 </b-col> 
                 <b-col sm="9">
                    <b-form-textarea
                      id="paymentMethod"
                      v-model="config.paymentMethod"
                      placeholder="Métodos de pago"
                      rows="3"
                      maax-rows="6"
                    ></b-form-textarea>
                 </b-col>
              </b-row>

          </b-card-text>
        </b-card>
      </b-modal>

      <b-modal
        :title="editedIndex == -1 ? 'Nueva zona' : 'Editar zona'"
        ref="edit"
        id="edit"
       
        >

        <template v-if="editedItem">
          

          <b-row class="mb-3">
            <b-col sm="12">
              <b-form-group label="Status:">
                <b-form-radio-group
                  id="btn-radios-1"
                  v-model="editedItem.status"
                  :options="[{text: 'Activo', value: true}, {text: 'Inactivo', value: ' '}]"
                  buttons
                   button-variant="outline-primary"
                ></b-form-radio-group>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row class="mb-3">
            <b-col sm="3">
                <label for="zipcode">Nombre:</label>
              </b-col>
              <b-col sm="9">
                <b-form-input v-model="editedItem.name" placeholder="Nombre"></b-form-input>
              </b-col>
            </b-row>
            <b-row>
              <b-col sm="3">
                <label for="zipcode">Zipcodes:</label>
              </b-col>
              <b-col sm="9">
              <b-form-textarea
                    id="zipcode"
                    v-model="editedItem.zipcode"
                    placeholder="Zipcodes"
                    rows="3"
                    maax-rows="6"
                  ></b-form-textarea>
              </b-col>
            </b-row>
            <b-row class="mt-3">
              <b-col sm="3">
                <label for="zipcode">Fechas de activacion:</label>
              </b-col>
              <b-col sm="9">
                <v-date-picker
                  mode='multiple'
                  v-model='editedItem.dates'>
                    <b-button
                      >
                      Almanaque
                    </b-button>
                    
                </v-date-picker>
              </b-col>
            </b-row>
            
            <b-row class="mt-3">
               <b-col sm="3">
                <label for="zipcode">Hora de inicio:</label>
              </b-col>
                <b-col sm="9">
                  <b-form-input type="time" v-model="editedItem.timeStart" placeholder="Hora de inicio"></b-form-input>
                </b-col>
            </b-row>
            <b-row>
               <b-col sm="3">
                <label for="zipcode">Hora de fin:</label>
              </b-col>
                <b-col sm="9">
                  <b-form-input type="time" v-model="editedItem.timeEnd" placeholder="Hora de fin"></b-form-input>
                </b-col>
            </b-row>
        </template>

        <div slot="modal-footer" class="w-100">
            <b-button
              variant="primary"
              size="sm"
              :class="editedIndex != -1 ? 'float-right' : ''"
              @click="$refs['edit'].hide()"
            >
              Cerrar
            </b-button>

            <b-button
              
              size="sm"
              class="ml-3 float-right"
              @click="saveEdit(); $refs['edit'].hide()"
              v-if="editedIndex == -1"
            > 
              Guardar
            </b-button>
            
          </div>
      </b-modal>
   
  </div>
    
</template>

<script>
const axios = require('axios')
const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3333/api' : 'http://localhost:3333/api'
export default {
  name: 'app',
  data () {
    return {
      config: {
        appliance: '',
        zones: [],
        status: 'Inactivo'
      },
      events: [],
      saved: false,
      editedIndex: null,
      editedItem: {
        dates: []
      }
    }
  },
  methods:{
    open() {
      console.log('open')
      const left = document.querySelector('#left-divider')
      if (left) {
        left.style.display = 'none'
      }
     },
    close() {
      console.log('close')

      const left = document.querySelector('#left-divider')
      if (left) {
        left.style.display = 'block'
      }
    },
    initialize() {
      let config = axios.get(`${baseURL}/config`).then((config) => {
        this.config = config.data
        console.log('config', config)
      })
    },

    deleteItem(zone) {
      const index = this.config.zones.indexOf(zone)
      this.$delete(this.config.zones, index)
    },
    save() {
      //localStorage.setItem('config', JSON.stringify(this.config))
      //console.log(JSON.parse(localStorage.getItem('config')))
      const { config } = this
      let res = axios.post(`${baseURL}/config`, { data: config })
        .then((res) => {
          console.log('save', config)  
        })
      
    },
    showEdit(zone) {
  
      console.log('zone', zone)
      if (zone) { 
         this.editedIndex = this.config.zones.indexOf(zone)
         if (zone.dates) {
           zone.dates = zone.dates.map((date) => {
            return new Date(date)
          })
         }
        this.editedItem = Object.assign(zone, {}) 

      }else {
        this.editedIndex = -1
        this.editedItem = {}
      }
      // JSON.parse(JSON.stringify(zone || {}))
   
      this.$refs['edit'].show()
    },
    saveEdit() {
      if (this.editedIndex == -1) {
        if (!this.config.zones) {
            this.config.zones = []
        }
        this.config.zones.push(this.editedItem)
      } else {
        this.config.zones.splice(this.editedIndex, 1, this.editedItem)
      }
      console.log(this.config)
    }
  },
  mounted() {
    this.initialize()
  },
   computed: {
    inputState() {
      if (!this.selectedValue) {
        return {
          type: 'is-danger',
          message: 'Date required.',
        };
      }
      return {
        type: 'is-primary',
        message: '',
      };
    },
  },
}
</script>
