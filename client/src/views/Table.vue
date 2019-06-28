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
						<label class="active" for="imported">Imported At</label>
						<div class="d-flex align-items-center">
							<input id="test" type="date" class="form-control" v-model="imported">
						</div>
					</div>
				</div>
				<div class="col-2 d-flex mt-4">
					<button
						type="button"
						class="btn btn-primary btn-sm btn-block"
						@click="filter()"
						:disabled="(!imported) ? true : false"
					>Filter</button>
				</div>
				<div class="col-2 d-flex mt-4">
					<router-link to="/employees/create" type="button" class="btn btn-success btn-block">Create</router-link>
				</div>

				<div class="col-2 d-flex mt-4">
					<div class="mr-auto">
						<button class="btn btn-success btn-round btn-sm mr-2" @click="downloadPdfCsv('pdf')">PDF</button>

						<button class="btn btn-success btn-round btn-sm mr-2" @click="downloadPdfCsv('csv')">CSV</button>

						<!-- show spinner and message while downloading pdf or csv data -->
						<!-- <div v-if="loadingPdfCsvData">
							<i class="fa fa-spinner fa-pulse fa-fw" v-if="loadingPdfCsvData"></i>
							downloading your file please wait...
						</div>-->
					</div>
				</div>
			</div>
			<table class="table table-striped">
				<thead class="thead-dark">
					<tr>
						<th>
							<div class="custom-control custom-checkbox my-1 mr-sm-2">
								<input
									type="checkbox"
									class="custom-control-input"
									id="customControlInline"
									v-model="selectAll"
								>
								<label class="custom-control-label" for="customControlInline"></label>
							</div>
						</th>
						<th class="column3" @click="sortBy('fullName')">Full Name</th>
						<th class="column3" @click="sortBy('dob')">Date of Birth</th>
						<th class="column3" @click="sortBy('gender')">Gender</th>
						<th class="column3" @click="sortBy('salary')">Salary</th>
						<th class="column3" @click="sortBy('designation')">Designation</th>
						<th class="column3"></th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="employee in employees" :key="employee._id">
						<td>
							<div class="custom-control custom-checkbox my-1 mr-sm-2">
								<input
									type="checkbox"
									class="custom-control-input"
									:id="employee._id"
									:value="employee._id"
									v-model="selectEmployee"
								>
								<label class="custom-control-label" :for="employee._id"></label>
							</div>
						</td>
						<td>{{employee.fullName}}</td>
						<td>{{employee.dob}}</td>
						<td>{{employee.gender}}</td>
						<td>{{employee.salary}}</td>
						<td>{{employee.designation}}</td>
						<td>
							<router-link :to="`/employees/edit/${employee._id}`">
								<span class="badge badge-warning">Edit</span>
							</router-link>
						</td>
					</tr>
				</tbody>
			</table>
			<pagination
				@gotoPage="gotoPage"
				:currentPage="page_no"
				:perPage="per_page"
				:totalPage="totalPage"
				:totalData="totalEmployees"
				v-if="employees.length"
			></pagination>
		</div>
	</div>
</template>
<script>
import Pagination from '../components/Pagination'
export default {
	components: {
		pagination: Pagination,
	},
	data() {
		return {
			loadingData: true,
			employees: [],
			error: '',
			imported: null,
			per_page: 3,
			page_no: 1,
			totalPage: 1,
			totalEmployees: 0,
			selectAll: false,
			selectEmployee: [],
			loadingPdfCsvData: false,
		}
	},
	created() {
		this.getEmployees()
	},
	methods: {
		gotoPage(pageNo, perPage) {
			this.page_no = pageNo
			this.per_page = perPage

			this.getEmployees()
		},
		getEmployees() {
			let instance = this
			this.axios
				.get(
					`${this.BASE_URL}/employees/${this.per_page}/${
						this.page_no
					}`
				)
				.then(result => {
					console.log('rrrrrrrrrrrrrrr', result)
					if (result.data.employees) {
						instance.employees = result.data.employees
						instance.totalEmployees = result.data.total
						instance.totalPage = Math.ceil(
							instance.totalEmployees / instance.per_page
						)
					}
					instance.loadingData = false
				})
				.catch(err => {
					console.log('Error on fetching data', err)
					instance.error =
						'Error on fetching data. Please check your connection.'
					instance.loadingData = false
				})
		},
		filter() {
			this.loadingData = true
			let instance = this
			// const createdAt = this.moment(this.created_at).toISOString()
			// const imported = this.imported
			this.axios
				.get(
					`${this.BASE_URL}/employees/${this.per_page}/${
						this.page_no
					}?imported=${this.imported}`
				)
				.then(result => {
					console.log('filter', result)
					if (result.data.employees) {
						instance.employees = result.data.employees
						instance.totalEmployees = parseInt(result.data.total)
						instance.totalPage = Math.ceil(
							instance.totalEmployees / instance.per_page
						)
					}
					instance.loadingData = false
				})
				.catch(err => {
					console.log('Error on fetching data', err)
					instance.error =
						'Error on fetching data. Please check your connection.'
					instance.loadingData = false
				})
		},
		sortBy(data) {
			let instance = this
			this.axios
				.get(
					`${this.BASE_URL}/employees/${this.per_page}/${
						this.page_no
					}?sort=${data}`
				)
				.then(result => {
					console.log('sort', result)
					if (result.data.employees) {
						instance.employees = result.data.employees
						instance.totalEmployees = parseInt(result.data.total)
						instance.totalPage = Math.ceil(
							instance.totalEmployees / instance.per_page
						)
					}
					instance.loadingData = false
				})
				.catch(err => {
					console.log('Error on fetching data', err)
					instance.error =
						'Error on fetching data. Please check your connection.'
					instance.loadingData = false
				})
		},
		downloadPdfCsv(pdfORcsv) {
			let instance = this

			let payload = {
				employeeId: this.selectEmployee,
				pdfORcsv: pdfORcsv,
			}

			// show loader while downloading pdf or csv file
			instance.loadingPdfCsvData = true

			this.axios
				.post(`${this.BASE_URL}/employees/download`, { payload })
				.then(response => {
					console.log('response', response)
					// download data if data comes from the server
					if (response.data != undefined) {
						let file_name = response.data.url.split('/')
						file_name = file_name.slice(file_name.length - 1)

						const downloadFile = document.createElement('a')
						downloadFile.setAttribute('href', response.data.url)
						downloadFile.setAttribute('target', '_blank')
						downloadFile.setAttribute('download', file_name)
						downloadFile.innerText = 'Click here'
						downloadFile.onclick = () => window.swal.close()

						this.swal('Your file is generated ', {
							button: false,
							content: downloadFile,
						})

						// hide loader and download pdf
						instance.loadingPdfCsvData = false
					} else {
						// show no found message and hide loader
						instance.loadingPdfCsvData = false
						console.log('No data found')
					}
				})
				.catch(err => {
					console.log('Error on download dot data', err)
					instance.loadingPdfCsvData = false
				})
		},
	},
	watch: {
		selectAll(val) {
			if (val) {
				this.selectEmployee = this.employees.map(
					employee => employee._id
				)
			} else {
				this.selectEmployee = []
			}
		},
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

th:hover,
.custom-control-label:hover {
	cursor: pointer;
}
</style>