<template>
  <b-container fluid>
    <!-- User Interface controls -->
    <b-row>
      <b-col md="6" class="my-3">
        <b-form-group label-cols-sm="3" label="Filtrar" class="mb-0">
          <b-input-group>
            <b-form-input v-model="filter" placeholder="Buscar"></b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">Limpiar</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
    </b-row>

    <b-row>
      <b-col md="3">
        <b-form-checkbox
          v-model="accepteds"
          value="true"
          unchecked-value="false"
        >Filtrar por aceptados</b-form-checkbox>
      </b-col>
    </b-row>

    <b-row class="my-3">
      <b-col md="3">
        <b-form-label>Desde</b-form-label>
        <b-form-input v-model="from" type="date"></b-form-input>
      </b-col>
      <b-col md="3">
        <b-form-label>Hasta</b-form-label>
        <b-form-input v-model="to" type="date"></b-form-input>
      </b-col>
      <b-col md="3" class="mt-4">
        <b-input-group-append>
          <b-button :disabled="!from && !to" @click="from = undefined; to = undefined">Limpiar</b-button>
        </b-input-group-append>
      </b-col>
      <b-col md="3" class="mt-4">
        <b-input-group-append>
          <a class="btn btn-primary" :href="downloadURL" download>Exportar</a>
        </b-input-group-append>
      </b-col>
    </b-row>
    <!-- Main table element -->
    <b-table show-empty stacked="md" :items="items" :fields="fields">
      <template v-slot:cell(accepted_at)="data">
        <img
          height="20px"
          width="20px"
          class="img-fluid"
          :src="require(`../assets/${data.item.accepted_at ? 'check' : 'error'}.png`)"
          :title="data.item.accepted_at ? `Aceptado el ${data.item.created_at}` : ''"
        />
      </template>
      <template v-slot:cell(schedule)="data">
        {{ data.item.schedule }}
        <img
          height="20px"
          width="20px"
          class="img-fluid"
          :src="require(`../assets/${data.item.match.schedule ? 'check' : 'error'}.png`)"
        />
      </template>
      <template v-slot:cell(location)="data">
        {{ data.item.location }}
        <img
          height="20px"
          width="20px"
          class="img-fluid"
          :src="require(`../assets/${data.item.match.location ? 'check' : 'error'}.png`)"
          :title="data.item.match.location"
        />
      </template>
      <template v-slot:cell(appliance)="data">
        {{ data.item.appliance }}
        <img
          height="20px"
          width="20px"
          class="img-fluid"
          :src="require(`../assets/${data.item.match.appliance ? 'check' : 'error'}.png`)"
          :title="data.item.match.appliance"
        />
      </template>
      <template v-slot:cell(paymentMethod)="data">
        {{ data.item.paymentMethod }}
        <img
          height="20px"
          width="20px"
          class="img-fluid"
          :src="require(`../assets/${data.item.match.paymentMethod ? 'check' : 'error'}.png`)"
          :title="data.item.match.paymentMethod"
        />
      </template>
    </b-table>

    <b-row>
      <b-col md="6" class="my-4">
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          class="my-0"
        ></b-pagination>
      </b-col>
      <b-col md="3">
        <label>Cantidad por pagina</label>
        <b-form-input v-model="perPage" type="number" placeholder="Por pagina"></b-form-input>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    accepteds: "false",
    items: [],
    from: undefined,
    to: undefined,
    fields: [
      {
        key: "created_at",
        label: "Registrado",
      },
      {
        key: "accepted_at",
        label: "Aceptado",
      },
      {
        key: "job",
        label: "ID",
      },
      {
        key: "schedule",
        label: "Hora",
        class: "text-center",
      },
      {
        key: "location",
        label: "Lugar",
        class: "text-center",
      },
      {
        key: "appliance",
        label: "Appliance",
        class: "text-center",
      },
      {
        key: "paymentMethod",
        label: "Pago",
        class: "text-center",
      },
      {
        key: "symptoms",
        label: "Sintomas",
        class: "text-center",
      },
    ],
    totalRows: 1,
    currentPage: 1,
    perPage: 20,
    pageOptions: [5, 10, 15],
    filter: "",
  }),
  computed: {},
  mounted() {
    // Set the initial number of items
    //

    this.getJobs();
  },
  methods: {
    getJobs() {
      let config = axios
        .get(
          `/jobs?from=${this.from ? this.from : ""}&to=${
            this.to ? this.to : ""
          }&accepteds=${this.accepteds}&filter=${this.filter}&perPage=${
            this.perPage
          }&page=${this.currentPage}`
        )
        .then((config) => {
          this.items = config.data.data;
          this.currentPage = config.data.page;
          this.totalRows = config.data.total;
          console.log("data", this.items);
        })
        .catch((error) => {
          this.$noty.error("Error al listar trabajos");
        });
    },
    exportar() {
      const link = document.createElement("a");
      // If you don't know the name or want to use
      // the webserver default set name = ''
      link.setAttribute("download", "text");
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
    },
  },
  computed: {
    downloadURL() {
      const uri = `${axios.defaults.baseURL}/jobs?from=${
        this.from ? this.from : ""
      }&to=${this.to ? this.to : ""}&accepteds=${this.accepteds}&filter=${
        this.filter
      }&perPage=${this.perPage}&page=${
        this.currentPage
      }&format=xlsx&exportar=true`;
      return uri;
    },
  },
  watch: {
    currentPage() {
      this.getJobs();
    },
    perPage() {
      this.getJobs();
    },
    filter() {
      this.getJobs();
    },
    accepteds() {
      this.getJobs();
    },
    from() {
      this.getJobs();
    },
    to() {
      this.getJobs();
    },
  },
};
</script>
