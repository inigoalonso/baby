<template>
  <v-container>
    Hej there, hur mår du?
    <Scatter/>
  </v-container>
</template>

<script>
import { db } from '@/firebase'
//import { betsCollection } from '@/firebase'
import { Scatter } from 'vue-chartjs'

export default {
  name: 'Graph',
  extends: Scatter,
  data () {
    return {
      data: [{
          x: 10,
          y: 20
      }, {
          x: 15,
          y: 10
      }],
      options: {
          scales: {
              xAxes: [{
                  type: 'linear',
                  position: 'bottom'
              }]
          }
      },
      keys: [
        'Name',
        'Length',
        'Weight',
        'Birthday',
        'Sex',
      ],
      items: [
        {
          name: 'Someone',
          length: 55,
          weight: 4000,
          birthday: "2020/10/10",
          sex: "girl",
        },
        {
          name: 'Someone else',
          length: 49,
          weight: 3000,
          birthday: "2020/10/01",
          sex: "girl",
        },
        {
          name: 'Other',
          length: 56,
          weight: 4500,
          birthday: "2020/10/19",
          sex: "boy",
        },
      ],
    }
  },
  computed: {
  },
  methods: {
    createBet(name, length, weight, birthday, sex) {
      if (name != "") {
        db.collection("bets")
          .add({ name: name, length: length, weight: weight, birthday: birthday, sex: sex })
          .then(() => {
            //console.log("Document successfully written!");
            this.readBets();
          })
          .catch((error) => {
            //console.error("Error writing document: ", error);
            error.length
          });
        this.name = "";
      }
    },
    readBets() {
      this.items = [];
      db.collection("bets")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.items.push({
              id: doc.id,
              name: doc.data().name,
              length: doc.data().length,
              weight: doc.data().weight,
              birthday: doc.data().birthday,
              sex: doc.data().sex,
            });
            //console.log(doc.id, " => ", doc.data());
          });
        })
        .catch((error) => {
          //console.log("Error getting documents: ", error);
          error.length
        });
    },
    updateBet(id, name, length, weight, birthday, sex) {
      db.collection("bets")
        .doc(id)
        .update({
          name: name, 
          length: length, 
          weight: weight, 
          birthday: birthday, 
          sex: sex,
        })
        .then(() => {
          //console.log("Document successfully updated!");
          this.readBets();
        })
        .catch((error) => {
          // The document probably doesn't exist.
          //console.error("Error updating document: ", error);
          error.length
        });
    },
    deleteBet(id) {
      db.collection("bets")
        .doc(id)
        .delete()
        .then(() => {
          //console.log("Document successfully deleted!");
          this.readBets();
        })
        .catch((error) => {
          //console.error("Error removing document: ", error);
          error.length
        });
    },
  },
  mounted() {
    this.readBets();
    this.renderChart(this.data, this.options);
  },
}
</script>