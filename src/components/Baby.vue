<template>
  <v-container fill-height>
    <v-row>
      <v-col>
        Hej
      </v-col>
      <v-col>
        <v-img src="@/assets/stork.svg" max-width=400px></v-img>
      </v-col>
    </v-row>
    <v-row>
      <v-data-iterator
        :items="items"
        :items-per-page.sync="itemsPerPage"
        :page="page"
        :search="search"
        :sort-by="sortBy.toLowerCase()"
        :sort-desc="sortDesc"
        hide-default-footer
      >
        <template v-slot:header>
          <v-toolbar
            dark
            color="light-green"
            class="mb-1"
          >
            <template>
              <v-dialog v-model="dialog" persistent max-width="600px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="green"
                    dark
                    v-bind="attrs"
                    v-on="on"
                  >
                    Add bet
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">Add bet</span>
                  </v-card-title>
                  <v-card-text class="text--light-green">
                    <v-form
                      ref="form"
                      v-model="valid"
                      lazy-validation
                    >
                      <v-text-field
                        v-model="name"
                        label="Your name"
                        required
                      ></v-text-field>

                      <v-slider
                        v-model="length"
                        class="align-center"
                        label="Length"
                        max="60"
                        min="45"
                        step="0.1"
                        hide-details
                      >
                        <template v-slot:append>
                          <v-text-field
                            v-model="length"
                            class="mt-0 pt-0"
                            hide-details
                            single-line
                            type="number"
                            style="width: 60px"
                          ></v-text-field>
                        </template>
                      </v-slider>

                      <v-slider
                        v-model="weight"
                        class="align-center"
                        label="Weight"
                        max="6000"
                        min="2000"
                        step="10"
                        hide-details
                      >
                        <template v-slot:append>
                          <v-text-field
                            v-model="weight"
                            class="mt-0 pt-0"
                            hide-details
                            single-line
                            type="number"
                            style="width: 60px"
                          ></v-text-field>
                        </template>
                      </v-slider>

                      <v-radio-group v-model="sex" row>
                        <v-radio label="Girl" value="girl"></v-radio>
                        <v-radio label="Boy" value="boy"></v-radio>
                      </v-radio-group>

                      <v-menu
                        v-model="menuBirthday"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="birthday"
                            label="Birthday"
                            prepend-icon="mdi-cake-variant"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker 
                          v-model="birthday" 
                          @input="menuBirthday = false"
                          first-day-of-week=1
                          min="2020-09-01"
                          max="2020-10-31"
                          show-current="2020-10-11"
                        ></v-date-picker>
                      </v-menu>

                    </v-form>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="light-green darken-1" text @click="reset;dialog=false">Close</v-btn>
                    <v-btn color="light-green darken-1" text @click="createBet(name, length, weight, birthday, sex);dialog = false">Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </template>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              clearable
              flat
              solo-inverted
              hide-details
              prepend-inner-icon="mdi-magnify"
              label="Search"
            ></v-text-field>
            <template v-if="$vuetify.breakpoint.mdAndUp">
              <v-spacer></v-spacer>
              <v-select
                v-model="sortBy"
                flat
                solo-inverted
                hide-details
                :items="keys"
                prepend-inner-icon="mdi-sort"
                label="Sort by"
              ></v-select>
              <v-spacer></v-spacer>
              <v-btn-toggle
                v-model="sortDesc"
                mandatory
              >
                <v-btn
                  large
                  depressed
                  color="light-green"
                  :value="false"
                >
                  <v-icon>mdi-arrow-up</v-icon>
                </v-btn>
                <v-btn
                  large
                  depressed
                  color="light-green"
                  :value="true"
                >
                  <v-icon>mdi-arrow-down</v-icon>
                </v-btn>
              </v-btn-toggle>
            </template>
          </v-toolbar>
        </template>

        <template v-slot:default="props">
          <v-row>
            <v-col
              v-for="item in props.items"
              :key="item.name"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <v-card>
                <v-card-title class="subheading font-weight-bold">{{ item.name }}</v-card-title>

                <v-divider></v-divider>

                <v-list dense>
                  <v-list-item
                    v-for="(key, index) in filteredKeys"
                    :key="index"
                  >
                    <v-list-item-content :class="{ 'light-green--text': sortBy === key }">{{ key }}:</v-list-item-content>
                    <v-list-item-content class="align-end" :class="{ 'light-green--text': sortBy === key }">{{ item[key.toLowerCase()] }}</v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </template>

        <template v-slot:footer>
          <v-row class="mt-2" align="center" justify="center">
            <span class="grey--text">Items per page</span>
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  dark
                  text
                  color="light-green"
                  class="ml-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  {{ itemsPerPage }}
                  <v-icon>mdi-chevron-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(number, index) in itemsPerPageArray"
                  :key="index"
                  @click="updateItemsPerPage(number)"
                >
                  <v-list-item-title>{{ number }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-spacer></v-spacer>

            <span
              class="mr-4
              grey--text"
            >
              Page {{ page }} of {{ numberOfPages }}
            </span>
            <v-btn
              fab
              dark
              color="light-green"
              class="mr-1"
              @click="formerPage"
            >
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn
              fab
              dark
              color="light-green"
              class="ml-1"
              @click="nextPage"
            >
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-row>
        </template>
      </v-data-iterator>
    </v-row>
  </v-container>
</template>

<script>
import { db } from '@/firebase'
import { betsCollection } from '@/firebase'

export default {
  data () {
    return {
      dialog: false,
      valid: true,
      name: '',
      nameRules: [
        v => !!v || 'Your name is required',
      ],
      length: '',
      lengthRules: [
        v => !!v || 'Length is required',
      ],
      weight: '',
      weightRules: [
        v => !!v || 'Weight is required',
      ],
      sex: null,
      birthday: null,
      menuBirthday: false,
      itemsPerPageArray: [4, 8, 12],
      search: '',
      filter: {},
      sortDesc: false,
      page: 1,
      itemsPerPage: 4,
      sortBy: 'name',
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
    numberOfPages () {
      return Math.ceil(this.items.length / this.itemsPerPage)
    },
    filteredKeys () {
      return this.keys.filter(key => key !== `Name`)
    },
  },
  methods: {
    reset () {
      this.$refs.form.reset()
    },
    nextPage () {
      if (this.page + 1 <= this.numberOfPages) this.page += 1
    },
    formerPage () {
      if (this.page - 1 >= 1) this.page -= 1
    },
    updateItemsPerPage (number) {
      this.itemsPerPage = number
    },
    createBet(name, length, weight, birthday, sex) {
      if (name != "") {
        db.collection("bets")
          .add({ name: name, length: length, weight: weight, birthday: birthday, sex: sex })
          .then(() => {
            console.log("Document successfully written!");
            this.readBets();
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
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
            console.log(doc.id, " => ", doc.data());
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    },
    updateBet(id, name, date) {
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
          console.log("Document successfully updated!");
          this.readBets();
        })
        .catch((error) => {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });
    },
    deleteBet(id) {
      db.collection("bets")
        .doc(id)
        .delete()
        .then(() => {
          console.log("Document successfully deleted!");
          this.readBets();
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    },
  },
  mounted() {
    this.readBets();
  },
}
</script>