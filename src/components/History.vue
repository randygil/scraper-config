<template>
	<b-container fluid>
		<!-- User Interface controls -->
		<b-row>
			<b-col md="6" class="my-3">
				<b-form-group label-cols-sm="3" label="Filtrar" class="mb-0">
					<b-input-group>
						<b-form-input
							v-model="filter"
							placeholder="Buscar"
						></b-form-input>
						<b-input-group-append>
							<b-button :disabled="!filter" @click="filter = ''"
								>Limpiar</b-button
							>
						</b-input-group-append>
					</b-input-group>
				</b-form-group>
			</b-col>
		</b-row>

		<!-- Main table element -->
		<b-table
			show-empty
			stacked="md"
			:items="history"
			:fields="fields"
			:current-page="currentPage"
			:per-page="perPage"
			:filter="filter"
			@filtered="onFiltered"
		>
		</b-table>

		<b-row>
			<b-col md="6" class="my-1">
				<b-pagination
					v-model="currentPage"
					:total-rows="totalRows"
					:per-page="perPage"
					class="my-0"
				></b-pagination>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
export default {
	props: ["history"],
	data: () => ({
		items: [],
		fields: [
			{
				key: "job",
				label: "ID"
			},
			{
				key: "schedule",
				label: "Hora",
				class: "text-center"
			},
			{
				key: "location",
				label: "Lugar",
				class: "text-center"
			},
			{
				key: "appliance",
				label: "Appliance",
				class: "text-center"
			},
			{
				key: "paymentMethod",
				label: "Método de pago",
				class: "text-center"
			},
			{
				key: "symptoms",
				label: "Sintomas",
				class: "text-center"
			},
			{
				key: "match",
				label: "Acciones"
			}
		],
		totalRows: 1,
		currentPage: 1,
		perPage: 4,
		pageOptions: [5, 10, 15],
		filter: null
	}),
	computed: {},
	mounted() {
		// Set the initial number of items
		//

		this.totalRows = this.history.length;
		console.log(this.history.length);
	},
	methods: {
		onFiltered(filteredItems) {
			// Trigger pagination to update the number of buttons/pages due to filtering
			this.totalRows = filteredItems.length;
			this.currentPage = 1;
		}
	},
	watch: {
		history() {
			this.totalRows = this.history.length;
			console.log(this.history.length);
		}
	}
};
</script>
