import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  Keyboard,
} from 'react-native';
import _ from 'lodash';
import {CommonActions} from '@react-navigation/native';
import {TextInputView, SpinnerView} from '../../../common/components';
import {MIcon, McIcon} from '../../../common/assets/vector-icon';
import {Color, Matrics} from '../../../common/styles';
import styles from './styles';

export const SystemPartsListForComplaintBooking = React.memo(
  ({
    item,
    visible,
    selectedProblems,
    modalVisible,
    selectedProblemsOptions,
    searchValue,
  }) => {
    const [searchTextValue, textInputForsearch] = useState();
    const [partsComplaint, getProblemComplaint] = useState();
    const [selectedItem, chooseSelected] = useState([]);
    const [idset, setIDValue] = useState();

    const changeTextForsearch = text => {
      const epi = item.filter(res =>
        replaceCustomExpression(res.CodeDesc).includes(
          replaceCustomExpression(text),
        ),
      );
      getProblemComplaint(epi);
      textInputForsearch(text);
      // this.setState({landmarkSearch: text, filterLandmarkList: epi});
    };

    const replaceCustomExpression = title => {
      // console.warn(title.replace(/[^a-zA-Z 0-9 | ]/ig, ""));
      const result = title.replace(/  +/g, ' '); // Replace multiple whitespace to a whitespace
      return result.replace(/[^a-zA-Z 0-9 | ]/gi, '').toLowerCase();
    };

    const chooseProblem = data => {
      const findIndex = _.findIndex(selectedItem, {ID: data.ID});
      if (findIndex > -1) {
        selectedItem.splice(findIndex, 1);
      } else {
        chooseSelected(_.concat(selectedItem, data));
      }
      if (idset == data.ID) {
        setIDValue('');
      } else {
        setIDValue(data.ID);
      }
    };

    const headerComponent = () => {
      return (
        <View style={{flexDirection: 'row', padding: 5}}>
          <TouchableOpacity
            style={styles.backIconTouch}
            onPress={() => modalVisible(false)}>
            <MIcon name="arrow-back" size={20} color={Color.black} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <TextInput
            placeholder={'Search Problems here...'}
            value={searchTextValue}
            autoFocus
            onChangeText={text => changeTextForsearch(text)}
            style={styles.textBoxField}
          />
          <TouchableOpacity
            style={styles.doneButtonTouch}
            onPress={() => {
              selectedProblems(selectedItem);
            }}>
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </View>
      );
    };

    const ListCompoent = (item, index) => {
      return (
        <TouchableOpacity
          key={`${index}_button`}
          style={styles.listView}
          activeOpacity={1}
          onPress={() => chooseProblem(item)}>
          <Text style={styles.listViewText}>{item.PartDescription}</Text>
          {renderSelectedIcon(item)}
        </TouchableOpacity>
      );
    };

    const renderSelectedIcon = item => {
      if (_.findIndex(selectedItem, {ID: item.ID}) > -1) {
        return (
          <View style={styles.iconView}>
            <MIcon
              name="check"
              size={Matrics.ScaleValue(18)}
              color={Color.primary}
            />
          </View>
        );
      }
    };

    useEffect(() => {
      getProblemComplaint(item);
      chooseSelected(selectedProblemsOptions);
      textInputForsearch(searchValue);
    }, [visible, item, selectedProblemsOptions]); // Only re-run the effect if images changes

    return (
      <>
        <Modal
          animationType="slide"
          transparent={false}
          visible={visible}
          onRequestClose={() => modalVisible(false)}>
          <View style={{marginTop: 5, flex: 1}}>
            {headerComponent()}
            <View style={{flex: 1}}>
              <FlatList
                data={_.uniqBy(partsComplaint, 'ID')}
                keyboardShouldPersistTaps={'always'}
                contentContainerStyle={{flexGrow: 1}}
                keyExtractor={item => `${item.ID}_ID`}
                style={{flex: 1}}
                renderItem={({item, index}) => ListCompoent(item, index)}
              />
            </View>
          </View>
        </Modal>
      </>
    );
  },
);
