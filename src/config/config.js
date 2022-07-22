import { lazy } from 'react'
import locales from './locales'
import routes from './routes'
import themes from './themes'
import parseLanguages from 'base-shell/lib/utils/locale'
import grants from './grants'
import Loading from 'material-ui-shell/lib/components/Loading/Loading'
import {
  defaultUserData,
  isGranted,
  isAnyGranted,
} from 'rmw-shell/lib/utils/auth'
import { getDefaultRoutes } from './getDefaultRoutes'

const config = {
  firebase: {
    prod: {
      initConfig: {
        apiKey: 'AIzaSyDiS3duryerph-juxroieJqJ3FxJoqdYsg',
        authDomain: 'kanopus-prod.firebaseapp.com',
        databaseURL: 'https://kanopus-prod-default-rtdb.firebaseio.com',
        projectId: 'kanopus-prod',
        storageBucket: 'kanopus-prod.appspot.com',
        messagingSenderId: '578241243859',
        appId: '1:578241243859:web:10015eebd48f9ef23a8226',
      },
      messaging: {
        publicVapidKey:
        'BFmxwwHsKfrSgopnGGP0PAKFmyxXsbb5z1cAj4exDv5XQueKbaZTyeOQYrU9zwWj7WZvRYFO0fcyDU0TSRxI1gM',
      },
    },
    devp: {
      initConfig: {
        apiKey: 'AIzaSyDiS3duryerph-juxroieJqJ3FxJoqdYsg',
        authDomain: 'kanopus-prod.firebaseapp.com',
        databaseURL: 'https://kanopus-prod-default-rtdb.firebaseio.com',
        projectId: 'kanopus-prod',
        storageBucket: 'kanopus-prod.appspot.com',
        messagingSenderId: '578241243859',
        appId: '1:578241243859:web:10015eebd48f9ef23a8226',
      },
      messaging: {
        publicVapidKey:
        'BFmxwwHsKfrSgopnGGP0PAKFmyxXsbb5z1cAj4exDv5XQueKbaZTyeOQYrU9zwWj7WZvRYFO0fcyDU0TSRxI1gM',
      },
    },
    dev: {
      initConfig: {
        apiKey: 'AIzaSyDiS3duryerph-juxroieJqJ3FxJoqdYsg',
        authDomain: 'kanopus-prod.firebaseapp.com',
        databaseURL: 'https://kanopus-prod-default-rtdb.firebaseio.com',
        projectId: 'kanopus-prod',
        storageBucket: 'kanopus-prod.appspot.com',
        messagingSenderId: '578241243859',
        appId: '1:578241243859:web:10015eebd48f9ef23a8226',
      },
      messaging: {
        publicVapidKey:
        'BFmxwwHsKfrSgopnGGP0PAKFmyxXsbb5z1cAj4exDv5XQueKbaZTyeOQYrU9zwWj7WZvRYFO0fcyDU0TSRxI1gM',
      },
    },
    firebaseuiProps: {
      signInOptions: [
        'google.com',
        'facebook.com',
        'twitter.com',
        'github.com',
        'password',
        'phone',
      ],
    },
  },
  googleMaps: {
    apiKey: 'AIzaSyByMSTTLt1Mf_4K1J9necAbw2NPDu2WD7g',
  },
  auth: {
    grants,
    redirectTo: '/dashboard',
    persistKey: 'base-shell:auth',
    signInURL: '/signin',
    onAuthStateChanged: async (user, auth) => {
      const { getDatabase, ref, onValue, get, update, off } = await import(
        'firebase/database'
      )
      const db = getDatabase()

      try {
        if (user != null) {
          const grantsSnap = await get(ref(db, `user_grants/${user.uid}`))
          const notifcationsDisabledSnap = await get(
            ref(db, `disable_notifications/${user.uid}`)
          )

          const isAdminSnap = await get(ref(db, `admins/${user.uid}`))

          onValue(ref(db, `user_grants/${user.uid}`), (snap) => {
            auth.updateAuth({ grants: snap.val() })
          })
          onValue(ref(db, `disable_notifications/${user.uid}`), (snap) => {
            auth.updateAuth({ notificationsDisabled: !!snap.val() })
          })
          onValue(ref(db, `admins/${user.uid}`), (snap) => {
            auth.updateAuth({ isAdmin: !!snap.val() })
          })

          auth.updateAuth({
            ...defaultUserData(user),
            grants: grantsSnap.val(),
            notificationsDisabled: notifcationsDisabledSnap.val(),
            isAdmin: !!isAdminSnap.val(),
            isGranted,
            isAnyGranted,
          })

          update(ref(db, `users/${user.uid}`), {
            displayName: user.displayName,
            uid: user.uid,
            photoURL: user.photoURL,
            providers: user.providerData,
            emailVerified: user.emailVerified,
            isAnonymous: user.isAnonymous,
            notificationsDisabled: notifcationsDisabledSnap.val(),
          })

          update(ref(db, `user_chats/${user.uid}/public_chat`), {
            displayName: 'Public Chat',
            lastMessage: 'Group chat',
            path: `group_chat_messages/public_chat`,
          })
        } else {
          off(ref(db))

          auth.setAuth(defaultUserData(user))
        }
      } catch (error) {
        console.warn(error)
      }
    },
  },
  getDefaultRoutes: getDefaultRoutes,
  routes,
  locale: {
    locales,
    persistKey: 'base-shell:locale',
    defaultLocale: parseLanguages(['en', 'de', 'ru'], 'en'),
    onError: (e) => {
      //console.warn(e)

      return
    },
  },
  menu: {
    MenuContent: lazy(() => import('../components/Menu/MenuContent')),
    MenuHeader: lazy(() =>
      import('material-ui-shell/lib/components/MenuHeader/MenuHeader')
    ),
  },
  theme: {
    themes,
    defaultThemeID: 'default',
    defaultType: 'dark',
  },
  pages: {
    LandingPage: lazy(() => import('../pages/LandingPage')),
    PageNotFound: lazy(() => import('../pages/PageNotFound')),
  },
  components: {
    Menu: lazy(() => import('material-ui-shell/lib/containers/Menu/Menu')),
    Loading,
  },

  containers: {
    LayoutContainer: lazy(() =>
      import('rmw-shell/lib/containers/LayoutContainer/LayoutContainer')
    ),
  },
}

export default config
