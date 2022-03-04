import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import PrimeVue from 'primevue/config'

import 'primevue/resources/themes/bootstrap4-light-blue/theme.css'      //theme
import 'primevue/resources/primevue.min.css'                 //core css
import 'primeicons/primeicons.css';                          //icons
import 'primeflex/primeflex.css'
createApp(App).use(store).use(router).use(PrimeVue, {
    locale: {
        startsWith: 'Inicia com',
        contains: 'Contem',
        notContains: 'Não contem',
        endsWith: 'Termina com',
        equals: 'Igual',
        notEquals: 'Diferente',
        noFilter: 'Sem filtro',
        lt: 'Menor que',
        lte: 'Menor ou igual à',
        gt: 'Maior que',
        gte: 'Maior ou igual à',
        dateIs: 'Data é',
        dateIsNot: 'Data não é',
        dateBefore: 'Data anterior',
        dateAfter: 'Data posterior',
        clear: 'Limpar',
        apply: 'Aplicar',
        matchAll: 'Corresponder Tudo',
        matchAny: 'Corresponder Qualquer',
        addRule: 'Adicionar Regra',
        removeRule: 'Remover Regra',
        accept: 'Sim',
        reject: 'Não',
        choose: 'eSCOLHER',
        upload: 'Upload',
        cancel: 'Cancelar',
        dayNames: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
        dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
        dayNamesMin: ["Do","Se","Te","Qa","Qi","Se","Sa"],
        monthNames: ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],
        monthNamesShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun","Jul", "Ago", "Set", "Out", "Nov", "Dez"],
        today: 'Hoje',
        weekHeader: 'Sm',
        firstDayOfWeek: 0,
        dateFormat: 'dd/mm/yy',
        weak: 'Semana',
        medium: 'Médio',
        strong: 'Forte',
        passwordPrompt: 'Entre com a senha',
        emptyFilterMessage: 'Nenhum resultado encontrado',
        emptyMessage: 'Sem opções'
    }
}).mount('#app')