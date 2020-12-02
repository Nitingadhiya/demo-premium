/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import CodePush from 'react-native-code-push';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {DefaultTheme, DarkTheme} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Provider as PaperProvider} from 'react-native-paper';

import {StackNavigator} from '../src/screens/stack';
import {DrawerContent} from '../src/screens/drawerContent';
import Events from './utils/events';
import CodePushComponent from './components/code-push-component';

const Drawer = createDrawerNavigator();

export default class AppVar extends React.Component {
  state = {
    gesture: false,
  };

  componentDidMount() {
    Events.on('gesture-manage', 'gesture', bool => {
      if (bool) {
        this.setState({
          gesture: bool,
        });
      } else {
        this.setState({
          gesture: false,
        });
      }
    });
  }

  render() {
    const {gesture} = this.state;
    return (
      <PaperProvider>
        <NavigationContainer>
          <Drawer.Navigator
            drawerContent={props => <DrawerContent {...props} />}>
            <Drawer.Screen
              name="Home"
              component={StackNavigator}
              options={{
                gestureEnabled: gesture,
              }}
            />
          </Drawer.Navigator>
        </NavigationContainer>
        <CodePushComponent />
      </PaperProvider>
    );
  }
}
// const App: () => React$Node = () => {
//   return (
//     <PaperProvider>
//       <NavigationContainer>
//         <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
//           <Drawer.Screen
//             name="Home"
//             component={StackNavigator}
//             options={{
//               gestureEnabled: false,
//             }}
//           />
//         </Drawer.Navigator>
//       </NavigationContainer>
//     </PaperProvider>
//   );
// };

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

let codePushOptions = {checkFrequency: CodePush.CheckFrequency.ON_APP_START};

let App = CodePush(codePushOptions)(AppVar);

export default App;

// export default App;
