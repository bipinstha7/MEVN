<template>
	<div class="container mt-4">
		<!-- <div v-if="error">{{error}}</div> -->
		<!-- show loader while fetching data -->
		<div class="lds-dual-ring" v-if="loadingData"></div>
		<div v-else>
			<h4 class="jumbotron">Manage Employees</h4>
			<div class="row mb-2">
				<div class="col-5">
					<div class="input-field input-field-shift">
						<label class="active" for="created_at">Created At</label>
						<div class="d-flex align-items-center">
							<input id="test" type="date" class="form-control" v-model="created_at">
						</div>
					</div>
				</div>
				<div class="col-2 d-flex mt-4">
					<button
						type="button"
						class="btn btn-primary btn-sm btn-block"
						@click="filter()"
						:disabled="(!created_at) ? true : false"
					>Filter</button>
				</div>
			</div>
			<table class="table table-striped">
				<thead class="thead-dark">
					<tr>
						<th class="column3">Full Name</th>
						<th class="column3">Date of Birth</th>
						<th class="column3">Gender</th>
						<th class="column3">Salary</th>
						<th class="column3">Designation</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(employee, index) in employees" :key="employee._id">
						<!-- <td>{{index + 1}}</td> -->
						<td>{{employee.fullName}}</td>
						<td>{{employee.dob}}</td>
						<td>{{employee.gender}}</td>
						<td>{{employee.salary}}</td>
						<td>{{employee.designation}}</td>
						<td>
							<router-link to="/edit">
								<span class="badge badge-warning" @click="editOrder(employee._id)">Edit</span>
							</router-link>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
<script>
import { create } from 'domain'
export default {
	data() {
		return {
			loadingData: true,
			employees: [],
			error: '',
			created_at: null,
		}
	},
	created() {
		let instance = this
		this.axios
			.get(`${this.BASE_URL}/employees`)
			.then(result => {
				console.log('rrrrrrrrrrrrrrr', result)
				instance.employees = result.data.employees
				instance.loadingData = false
			})
			.catch(err => {
				console.log('Error on fetching data', err)
				instance.error =
					'Error on fetching data. Please check your connection.'
				instance.loadingData = false
			})
	},
	methods: {
		filter() {
			this.loadingData = true
			let instance = this
			// const createdAt = this.moment(this.created_at).toISOString()
			const createdAt = this.created_at
			this.axios
				.get(`${this.BASE_URL}/employees/${createdAt}`)
				.then(result => {
					console.log('filter', result)
					instance.employees = result.data.employees
					instance.loadingData = false
				})
				.catch(err => {
					console.log('Error on fetching data', err)
					instance.error =
						'Error on fetching data. Please check your connection.'
					instance.loadingData = false
				})
		},
		// deleteOrder(id) {
		// 	// 	Todo: show some kind of model before deleting the order
		// 	axios
		// 		.delete(`ingredients/${id}`)
		// 		.then(result =>
		// 			res.status(200).send({
		// 				message: 'Order Deleted Successfully',
		// 				result: result,
		// 			})
		// 		)
		// 		.catch(err =>
		// 			res.status(500).send({
		// 				message:
		// 					'Can not delete your order. Something bad happened',
		// 				err: err.message,
		// 			})
		// 		)
		// },
	},
}
</script>
<style scoped>
.lds-dual-ring {
	display: inline-block;
	width: 64px;
	height: 64px;
	margin: 25% 50%;
}
.lds-dual-ring:after {
	content: ' ';
	display: block;
	width: 46px;
	height: 46px;
	margin: 1px;
	border-radius: 50%;
	border: 5px solid #000;
	border-color: #000 transparent #000 transparent;
	animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>