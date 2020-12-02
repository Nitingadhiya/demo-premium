import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert
} from 'react-native';

import CodePush from 'react-native-code-push';
// import {Matrics, Color, Fonts} from '../../common/';
import { Color } from '../../common/styles';
// import { ifIphoneX } from '../../package';

class CodePushComponent extends Component<{}> {
  constructor() {
    super();
    this.state = {restartAllowed: true};
  }

  componentDidMount() {
    this.sync();
   // SplashScreen.hide();
  }



  codePushStatusDidChange(syncStatus) {
    switch (syncStatus) {
      case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
       // this.setState({syncMessage:'Check for update'});
        break;
      case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
        this.setState({syncMessage:'Downloading package'});
        break;
      case CodePush.SyncStatus.AWAITING_USER_ACTION:
        this.setState({syncMessage: 'Awaiting user action'});
        break;
      case CodePush.SyncStatus.INSTALLING_UPDATE:
        this.setState({syncMessage:'Installing update'});
        break;
      case CodePush.SyncStatus.UP_TO_DATE:
        //this.setState({syncMessage: 'App up to date', progress: false});
        // setTimeout(()=>{
        //   this.setState({
        //     syncMessage: null
        //   });
        // },2000);
        break;
      case CodePush.SyncStatus.UPDATE_IGNORED:
        this.setState({
          syncMessage: 'Update cancelled by user',
          progress: false,
        });
        break;
      case CodePush.SyncStatus.UPDATE_INSTALLED:
        this.setState({
          syncMessage: 'Update installed and will be applied on restart',
          progress: false,
        });
        this.appUpdateCodePushAvailable();
        setTimeout(()=>{
          this.setState({
            syncMessage: null
          });
        },5000);
        break;
      case CodePush.SyncStatus.UNKNOWN_ERROR:
        this.setState({
          syncMessage: 'An unknown error occurred',
          progress: false,
        });
        break;
    }
  }

  appUpdateCodePushAvailable(){
    Alert.alert(
      'New Version Available',
      'Please update app to new version to continue using.',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        { text: 'OK', onPress: () => CodePush.restartApp()      }
      ],
      { cancelable: false }
    );
  }

  codePushDownloadDidProgress(progress) {
    this.setState({progress});
  }

  // toggleAllowRestart() {
  //   this.state.restartAllowed
  //     ? CodePush.disallowRestart()
  //     : CodePush.allowRestart();

  //   this.setState({restartAllowed: !this.state.restartAllowed});
  // }

  // getUpdateMetadata() {
  //   CodePush.getUpdateMetadata(CodePush.UpdateState.RUNNING).then(
  //     (metadata: LocalPackage) => {
  //       console.log(metadata, 'package');
  //       this.setState({
  //         syncMessage: metadata
  //           ? JSON.stringify(metadata)
  //           : 'Running binary version',
  //         progress: false,
  //       });
  //     },
  //     (error: any) => {
  //       this.setState({syncMessage: 'Error: ' + error, progress: false});
  //     },
  //   );
  // }

  /** Update is downloaded silently, and applied on restart (recommended) */
  sync() {
    CodePush.sync(
      {},
      this.codePushStatusDidChange.bind(this),
      this.codePushDownloadDidProgress.bind(this),
    );
  }

  /** Update pops a confirmation dialog, and then immediately reboots the app */
  // syncImmediate() {
  //   CodePush.sync(
  //     {installMode: CodePush.InstallMode.IMMEDIATE, updateDialog: true},
  //     this.codePushStatusDidChange.bind(this),
  //     this.codePushDownloadDidProgress.bind(this),
  //   );
  // }

  render() {
    const {syncMessage} = this.state;
    if(!syncMessage){
      return <View />
    }
      return (
        <View style={styles.syncMessageView}>
          <Text style={styles.appstatus}>{syncMessage || ''}</Text>
        </View>
      );
    
  }
}

const styles = StyleSheet.create({
  syncMessageView: {
    backgroundColor: Color.primary,
    padding: 4,
    alignItems: 'center',
    // ...ifIphoneX({
    //   paddingBottom: 25
    // })
  },
  appstatus: {
    color: Color.white,
    fontSize: 11,
    //fontFamily: Fonts.type.Rubik,
    textAlign: 'center'
  },
  syncButton: {
    color: Color.white,
    fontSize: 14,
  }
});

/**
 * Configured with a MANUAL check frequency for easy testing. For production apps, it is recommended to configure a
 * different check frequency, such as ON_APP_START, for a 'hands-off' approach where CodePush.sync() does not
 * need to be explicitly called. All options of CodePush.sync() are also available in this decorator.
 */

export default CodePushComponent;
