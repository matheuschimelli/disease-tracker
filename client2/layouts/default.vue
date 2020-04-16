<template>
  <v-app>
    <v-content class="dtContent">
      <div v-if="$route.path === '/'" class="panel">
        <div class="sidebar">
          <div class="item">
            <v-card
              v-if="$store.state.user"
              class="mx-auto"
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
                    <v-icon class="mr-1">apps</v-icon>
                  </v-row>
                </v-list-item>
              </v-card-actions>
            </v-card>
          </div>

          <div class="mainNav">
            <div class="item">
              <v-card>
                <v-card-title>disease tracker</v-card-title>
                <v-card-text>
                  <p>
                    disease tracker is a social map service that provides data
                    in maps, alerts and help about COVID-19. disease tracker
                    provides information about incidents near from you to keep
                    you safe.<br />
                    <b>#stay at home</b>
                  </p>
                </v-card-text>
              </v-card>
            </div>
            <div class="item">
              <v-card flat>
                <v-card elevation="12" width="300">
                  <v-navigation-drawer floating permanent>
                    <v-list dense rounded>
                      <v-list-item link to="incident/new">
                        <v-list-item-icon>
                          <v-icon>add_location</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                          <v-list-item-title>New incident</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item link>
                        <v-list-item-icon>
                          <v-icon>add_alert</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                          <v-list-item-title>Notifications</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item link>
                        <v-list-item-icon>
                          <v-icon>add_ic_call</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                          <v-list-item-title
                            >Call a doctor online</v-list-item-title
                          >
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item link>
                        <v-list-item-icon>
                          <v-icon>report</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                          <v-list-item-title
                            >Report wrong information</v-list-item-title
                          >
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-navigation-drawer>
                </v-card>
              </v-card>
            </div>
            <div v-if="!$store.state.user" class="item">
              <v-card>
                <v-card-actions>
                  <LoginGoogleBtn />
                </v-card-actions>
              </v-card>
            </div>
          </div>
        </div>
      </div>

      <nuxt />
    </v-content>
  </v-app>
</template>

<script>
import LoginGoogleBtn from '../components/LoginGoogleBtn'

export default {
  components: {
    LoginGoogleBtn
  }
}
</script>
<style scoped>
.panel {
  top: 30px;
  position: absolute;
  z-index: 450;
  background: transparent;
  left: 50px;
}
.dtContent {
  background: transparent;
  z-index: 450;
}
.logo {
  font-family: 'Open Sans', sans-serif;
  color: #373737;
  font-size: 20px;
}
.incidentBox {
  font-family: 'Open Sans', sans-serif;

  font-size: 14px;
}
.incidentBox span {
  font-weight: bold;
}
.incidentBox li {
  list-style-type: none;
}
.incidentBtn {
  margin: 5px auto;
}
.date {
  font-size: 12px !important;
}
.sidebar {
  display: flex;
  flex-direction: column;
  width: 300px;
  font-family: 'Open Sans', sans-serif;
}
.item {
  margin-bottom: 10px;
}
</style>
