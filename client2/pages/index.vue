<template>
  <v-app>
    <div>
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
              :lat-lng.sync="currentUserPosition"
              :icon="userIcon"
              :draggable="true"
            >
            </l-marker>
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
      <v-menu
        v-model="showMenu"
        :position-x="x"
        :position-y="y"
        absolute
        offset-y
      >
        <v-list>
          <v-list-tile>
            <v-list-tile-title>custom menu</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </div>
  </v-app>
</template>

<script>
import L from 'leaflet'
export default {
  data() {
    return {
      locationAvaliable: false,
      currentUserPosition: {
        lat: 47.41322,
        lng: -1.219482
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
      showMenu: false,
      x: 0,
      y: 0
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
        this.locationAvaliable = true
      })
    }
    this.loadInitialData()
  },
  methods: {
    async loadInitialData() {
      try {
        const { data } = await this.$axios.get('/api/v1/incidents')
        this.incidents = data
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
.leaflet-popup {
  width: 310px;
}
.incidentBox {
  font-family: 'Open Sans', sans-serif;
  font-size: 14px;
}
.incidentBox li {
  list-style-type: none;
}
.incidentBtn {
  margin-top: 10px;
}
.incidentTitle {
  font-weight: bold;
}
</style>
