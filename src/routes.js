import Home from './components/Home.vue';
import Signup from './components/Auth/Signup.vue';
import Signin from './components/Auth/Signin.vue';
import Profile from './components/Profile.vue';
import City from './components/City.vue';
import Sight from './components/Sight.vue';
import Sights from './components/Sights.vue';
import Map from './components/Map.vue';
import Information from './components/Information.vue'

export const routes = [
    { path: '', component: Home, name: 'Home'},
    { path: '/signup', component: Signup, name: 'Signup'},
    { path: '/signin', component: Signin, name: 'Signin'},
    { path: '/:username', component: Profile, children: [
        { path: '', component: Map },
        { path: 'information', component: Information},
        { path: ':source', component: Sights },
    ]},
    { path: '/:username/:city/:lat/:lng', component: City, name: 'City'},
    { path: '/:username/Sight/:placeid', component: Sight, name: 'Sight'},
    { path: '/:username/:city/:placeid', component: Sight, name: 'SightTwo'},
    { path: '*', redirect: ''},
];
