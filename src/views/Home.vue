<template>
  <div class="flex justify-content-center align-items-center">
    <Card v-if="info" style="width: 80vw">
      <template #title>
        <div class="flex user-info">
          <div>
            <img :src="info.avatar_url" height="50"/>
          </div>
          <div class="flex align-items-center login-info">
            {{ info.login }} -&nbsp;<i><a :href="info.html_url">{{ info.html_url }}</a></i>
          </div>
        </div>
      </template>
      <template #content>
        <Card class="flex">
          <template #content>
            <div class="flex justify-content-start">
              <span class="p-float-label">
                <InputText id="login" type="text" v-model="login" @keydown.enter="serviceGithub" />
                <label for="login">Login Github</label>
              </span>
            </div>
          </template>
        </Card>
        <DataTable :value="info.repos" :paginator="true" class="p-datatable-customers" showGridlines :rows="10"
                   dataKey="id" v-model:filters="filters" filterDisplay="menu" :loading="loading" responsiveLayout="scroll"
                   :globalFilterFields="['full_name','description','visibility']">
          <template #header>
            <div class="flex justify-content-between">
              <Button type="button" icon="pi pi-filter-slash" label="Limpar Filtros" class="p-button-outlined" @click="clearFilter()"/>
              <span class="p-input-icon-left">
                  <i class="pi pi-search" />
                  <InputText v-model="filters['global'].value" placeholder="Digite um Nome, Descrição" />
              </span>
            </div>
          </template>
          <template #empty>
            Nenhum repositório encontrado.
          </template>
          <template #loading>
            Carregando repositórios. Aguarde...
          </template>
          <Column field="full_name" header="Nome" style="min-width:12rem">
            <template #body="{data}">
              {{data.full_name}}
            </template>
            <template #filter="{filterModel}">
              <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Busca por nome"/>
            </template>
          </Column>
          <Column field="description" header="Descrição" style="min-width:12rem">
            <template #body="{data}">
              {{data.description}}
            </template>
            <template #filter="{filterModel}">
              <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Busca por descrição"/>
            </template>
          </Column>
          <Column header="Criado em" filterField="created_at" dataType="date" style="min-width:10rem">
            <template #body="{data}">
              {{ formatDate(data.created_at) }}
            </template>
            <template #filter="{filterModel}">
              <Calendar v-model="filterModel.value" dateFormat="dd/mm/yy" placeholder="dd/mm/yyyy" />
            </template>
          </Column>
          <Column header="Última Atualização" filterField="pushed_at" dataType="date" style="min-width:10rem">
            <template #body="{data}">
              {{formatDate(data.pushed_at)}}
            </template>
            <template #filter="{filterModel}">
              <Calendar v-model="filterModel.value" dateFormat="dd/mm/yy" placeholder="dd/mm/yyyy" />
            </template>
          </Column>
          <Column field="visibility" header="Visibilidade" :filterMenuStyle="{'width':'14rem'}" style="min-width:12rem">
            <template #body="{data}">
              {{data.visibility}}
            </template>
            <template #filter="{filterModel}">
              <Dropdown v-model="filterModel.value" :options="visibilities" placeholder="Qualquer" class="p-column-filter" :showClear="true">
                <template #value="slotProps">
                  <span :class="'customer-badge status-' + slotProps.value" v-if="slotProps.value">{{slotProps.value}}</span>
                  <span v-else>{{slotProps.placeholder}}</span>
                </template>
                <template #option="slotProps">
                  <span :class="'customer-badge status-' + slotProps.option">{{slotProps.option}}</span>
                </template>
              </Dropdown>
            </template>
          </Column>
          <Column field="archived" header="Arquivado" dataType="boolean" bodyClass="text-center" style="min-width:8rem">
            <template #body="{data}">
              <i class="pi" :class="{'true-icon pi-check-circle': data.archived, 'false-icon pi-times-circle': !data.archived}"></i>
            </template>
            <template #filter={filterModel}>
              <TriStateCheckbox v-model="filterModel.value" />
            </template>
          </Column>
          <Column field="has_issue" header="Problemas" dataType="boolean" bodyClass="text-center" style="min-width:8rem">
            <template #body="{data}">
              <i class="pi" :class="{'true-icon pi-check-circle': data.has_issue, 'false-icon pi-times-circle': !data.has_issue}"></i>
            </template>
            <template #filter={filterModel}>
              <TriStateCheckbox v-model="filterModel.value" />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<script setup>
import Button from "primevue/button"
import Card from "primevue/card"
import InputText from 'primevue/inputtext';
import TriStateCheckbox from 'primevue/tristatecheckbox';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import axios from  'axios';
import {onMounted, ref} from "vue";
import {FilterMatchMode,FilterOperator} from 'primevue/api';

let info = ref(null);
let login = ref("detulio")

const filters = ref({
  'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
  'full_name': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
  'description': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
  'created_at': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.DATE_IS}]},
  'pushed_at': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.DATE_IS}]},
  'visibility': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.EQUALS}]},
  'archived': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.EQUALS}]},
  'has_issues': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.EQUALS}]},
});

const visibilities = ref([
   'public', 'private'
]);

const formatDate = (value) => {
  return value.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

let loading = ref(false);

const serviceGithub = () => {
  localStorage.setItem('gitLogin', login.value)

  loading.value = true;
  axios.get(`https://api.github.com/users/${login.value}`).then(resp => {
    info.value = resp.data
    axios.get(`https://api.github.com/users/${login.value}/repos`).then(resp => {
      info.value.repos = resp.data
      info.value.repos.forEach(function (v, i){
        info.value.repos[i].created_at = new Date(v.created_at)
        info.value.repos[i].pushed_at = new Date(v.pushed_at)
      })
      loading.value = false
    }).catch(() => {
      loading.value = false
    }).catch(() => {
      loading.value = false
    })
  });
}

onMounted(() => {
  login.value = localStorage.getItem('gitLogin') || 'detulio'
  serviceGithub()
})

const clearFilter = () => {
  initFilters();
};
const initFilters = () => {
  filters.value = {
    'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
    'full_name': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
    'description': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
    'created_at': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.DATE_IS}]},
    'pushed_at': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.DATE_IS}]},
    'visibility': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.EQUALS}]},
    'archived': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.EQUALS}]},
    'has_issues': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.EQUALS}]},
  }
};

</script>

<style scoped>
  img {
    border-radius: 50px;
  }

  .user-info {
    border: solid 1px lightgray;
    border-radius: 5px;
    padding: 10px 5px 5px 10px;
    box-shadow: lightgray 2px 2px;
  }

  .login-info {
    font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
    font-size: 22px;
    padding-left: 10px;
  }
</style>
