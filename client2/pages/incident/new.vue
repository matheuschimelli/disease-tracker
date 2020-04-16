<template>
  <v-app>
    <v-row no-gutters>
      <v-col md="3">
        <v-card
          v-if="$store.state.user"
          class="mx-auto"
          tile
          dark
          min-width="300"
        >
          <v-card-actions>
            <v-list-item class="grow">
              <v-list-item-avatar color="grey darken-3">
                <v-img
                  class="elevation-6"
                  :src="$store.state.user.user.profile.picture"
                ></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{
                  $store.state.user.user.profile.name
                }}</v-list-item-title>
              </v-list-item-content>

              <v-row align="center" justify="end">
                <nuxt-link to="/"
                  ><v-icon class="mr-1">clear</v-icon></nuxt-link
                >
              </v-row>
            </v-list-item>
          </v-card-actions>
        </v-card>
        <div class="sidebarContent">
          <v-card>
            <v-card-title>Add new incident</v-card-title>
            <v-card-subtitle
              >You are adding a new incident. Be sure of add true information.
              Before published all incidents are analised. Fake data may result
              on account suspension</v-card-subtitle
            >
          </v-card>
          <v-form class="form">
            <v-text-field
              v-model="newIncident.title"
              label="Incident Title"
              single-line
              solo
            ></v-text-field>
            <v-textarea
              v-model="newIncident.description"
              label="Incident description"
              single-line
              solo
            ></v-textarea>
            <v-select
              v-model="newIncident.incidentType"
              hint="Choose a incident type"
              :items="incidentTypes"
              item-text="name"
              item-value="_id"
              label="Incident type"
              persistent-hint
              return-object
              single-line
              solo
            ></v-select>
            <v-text-field
              solo
              disabled
              label="Latitude"
              title="Logitude"
              :value="newIncident.lat"
            ></v-text-field>
            <v-text-field
              solo
              disabled
              label="Longitude"
              title="Longitude"
              :value="newIncident.lng"
            ></v-text-field>
            <v-slider
              v-model="newIncident.dangerLevel"
              thumb-label="always"
              min="10"
              max="100000"
              label="Danger level"
              :color="color"
              track-color="grey"
              always-dirty
            >
              <template v-slot:append>
                <v-text-field
                  v-model="newIncident.dangerLevel"
                  class="mt-0 pt-0"
                  hide-details
                  single-line
                  type="number"
                  style="width: 60px"
                ></v-text-field> </template
            ></v-slider>
            <v-btn
              depressed
              small
              color="primary"
              block
              large
              @click="submitNewIncident"
              >Submit</v-btn
            >
          </v-form>
        </div>
      </v-col>
      <v-col md="9">
        <client-only>
          <div class="mapView">
            <l-map
              v-if="locationAvaliable"
              :zoom="13"
              :center="[currentUserPosition.lat, currentUserPosition.lng]"
            >
              <l-tile-layer
                url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                attribution="OpenStreet Maps"
              >
              </l-tile-layer>

              <l-marker
                :lat-lng.sync="newIncident"
                :icon="incidentIcon"
                :draggable="true"
              >
              </l-marker>

              <l-circle
                :lat-lng.sync="newIncident"
                :radius="newIncident.dangerLevel"
                :color="color"
                :fill-color="color"
              >
              </l-circle>
              <div v-for="incident in incidents" :key="incident._id">
                <l-circle
                  :lat-lng="[
                    incident.location.coordinates[1],
                    incident.location.coordinates[0]
                  ]"
                  :radius="incident.dangerLevel"
                  color="red"
                  fill-color="red"
                >
                  <l-popup
                    ><div class="incidentBox">
                      <span class="incidentTitle"
                        ><v-icon v-if="incident.verified" color="primary"
                          >verified_user </v-icon
                        >{{ incident.title }}</span
                      >
                      <br />
                      <span class="date"
                        >{{ incident.creationDate }}
                        {{ incident.creationTime }}</span
                      >
                      <div v-if="incident.person">
                        <p>{{ incident.description }}</p>
                        <li>Gender: {{ incident.person.gender }}</li>
                        <li>Age: {{ incident.person.age }}</li>
                        <li>
                          <span v-if="incident.person.traveledAbroad">
                            Has traveled abroad</span
                          >
                          <span v-else> Didn't traveled abroad</span>
                        </li>
                      </div>
                      <v-btn depressed color="primary" small class="incidentBtn"
                        >Get alerts about this incident</v-btn
                      >
                    </div>
                  </l-popup>
                </l-circle>
              </div>
            </l-map>
          </div>
        </client-only>
      </v-col>
    </v-row>
    <v-overlay :value="overlay" class="customOverlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-app>
</template>

<script>
import L from 'leaflet'
export default {
  middleware: 'userLoggedIn',
  data() {
    return {
      incidentTypes: [],
      locationAvaliable: false,
      currentUserPosition: {
        lat: null,
        lng: null
      },
      newIncident: {
        incidentType: { type: 'Choose a type', id: null },
        dangerLevel: 90,
        lat: null,
        lng: null
      },
      incidents: [],
      userIcon: L.icon({
        iconUrl: '/mapIcons/userLocation.png',
        iconSize: [32, 32],
        iconAnchor: [32, 32]
      }),
      incidentIcon: L.icon({
        iconUrl: '/mapIcons/incident.png',
        iconSize: [64, 64],
        iconAnchor: [10, 60]
      }),
      overlay: false
    }
  },
  computed: {
    color() {
      if (this.newIncident.dangerLevel < 10) return 'green' // green
      if (this.newIncident.dangerLevel < 100) return 'teal'
      if (this.newIncident.dangerLevel < 800) return 'orange' // orange
      if (this.newIncident.dangerLevel < 1000) return 'indigo' // ingido
      return 'red'
    }
  },
  watch: {
    userLocation(val) {
      console.log(val)
    }
  },
  mounted() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((currentLocation) => {
        this.currentUserPosition.lat = currentLocation.coords.latitude
        this.currentUserPosition.lng = currentLocation.coords.longitude
        this.newIncident.lat = currentLocation.coords.latitude
        this.newIncident.lng = currentLocation.coords.longitude

        this.locationAvaliable = true
      })
    }
    this.loadInitialData()
    this.loadIncidentTypes()
  },
  methods: {
    async submitNewIncident() {
      this.overlay = true

      try {
        const { data } = await this.$axios.post('/api/v1/incidents', {
          ...this.newIncident
        })
        this.overlay = false

        console.log(data)
      } catch (error) {
        this.overlay = false

        console.log(error)
      }
    },
    async loadInitialData() {
      try {
        const { data } = await this.$axios.get('/api/v1/incidents')
        this.incidents = data
      } catch (error) {
        console.log(error)
      }
    },
    async loadIncidentTypes() {
      try {
        const { data } = await this.$axios.get('/api/v1/incidenttypes')
        this.incidentTypes = data
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
<style scoped>
.mapView {
  width: 100%;
  height: 100vh;
}
.sidebarContent {
  padding: 10px;
}
.form {
  margin-top: 10px;
}
.incidentLocation {
  background: white;
  color: #373737;
  font-size: 14px;
  padding: 4px;
  border-radius: 4px;
  width: 150px;
  text-align: center;
  border: 4px solid red;
  font-weight: bold;
}
.customOverlay {
  z-index: 410 !important;
}
</style>
