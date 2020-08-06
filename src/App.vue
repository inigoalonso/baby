<template>
  <v-app>
    
    <v-main>
      <Graph/>
    </v-main>
    
    <v-footer 
      app 
      absolute
    >
      <div class="mx-auto">
        Made with ❤️ by Pernilla and Iñigo
      </div>
    </v-footer>
    
  </v-app>
</template>

<script>
//import Baby from './components/Baby';
import Graph from './components/Graph';

export default {
  name: 'App',

  components: {
    //Baby,
    Graph,
  },

  data: () => ({
    //
  }),
};
</script>
