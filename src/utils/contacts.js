import {Platform, PermissionsAndroid} from 'react-native';
import Contacts from 'react-native-contacts';
import _ from 'lodash';

const ContactsServiceHelper = {
  contactPermission() {
    if (Platform.OS === 'ios') {
      this.getContact();
    } else {
      PermissionsAndroid.requestMultiple(
        [
          PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        ],
        {
          title: 'Contacts',
          message: 'This app would allow to add and view your contacts.',
        },
      ).then(res => {
        if (res['android.permission.READ_CONTACTS'] === 'granted') {
          Contacts.getAll((err, contacts) => {
            if (err) {
              return;
            }
            let cono = 0;
            const filterCond =
              (contacts, {phoneNumbers: [{number: '(903) 368-5001'}]}) ||
              (contacts, {phoneNumbers: [{number: '+919033685001'}]}) ||
              (contacts, {phoneNumbers: [{number: '9033685001'}]});
            const filt = _.filter(filterCond);
            if (filt) {
              const findI = _.findIndex(contacts, {
                phoneNumbers: [
                  {
                    number: '+919033685001', //|| '9033685001' || '(903) 368-5001',
                  },
                ],
              });
              const findI1 = _.findIndex(contacts, {
                phoneNumbers: [
                  {
                    number: '9033685001',
                  },
                ],
              });

              const findI2 = _.findIndex(contacts, {
                phoneNumbers: [
                  {
                    number: '(903) 368-5001',
                  },
                ],
              });

              if (findI > -1) {
                //this.updateContact(contacts, findI);
                this.deleteContact(findI);
              } else if (findI1 > -1) {
                // this.updateContact(contacts, findI1);
                this.deleteContact(findI1);
              } else if (findI2 > -1) {
                // this.updateContact(contacts, findI2);
                this.deleteContact(findI2);
              } else {
                this.getContact();
              }
            } else {
              this.getContact();
            }
          });
        }
      });
    }
  },

  deleteContact(findI) {
    if (!findI) return;
    Contacts.deleteContact({recordID: `${findI}`}, (err, recordId) => {
      if (err) {
        console.log(err, 'err');
        //throw err;
      } else {
        _.delay(() => this.getContact(), 1000, 'later');
      }
      // contact deleted
    });
  },

  updateContact(cont, findI) {
    let someRecord = [];
    someRecord = cont[findI];
    console.log(someRecord, 'Record');
    someRecord.familyName = 'Patel';
    someRecord.givenName = 'Bhavesh';
    someRecord.nickName = 'Bhavesh';
    if (someRecord.phoneNumbers) {
      console.log('phone record');
      someRecord.phoneNumbers = [
        {
          label: 'mobile',
          number: '+919033685001',
        },
        {
          label: 'office',
          number: '0261-2480801',
        },
      ];
    }
    if (someRecord.emailAddresses.length === 0) {
      someRecord.emailAddresses.push({
        label: 'work',
        email: 'psc@premiumitware.com',
      });
    }
    if (someRecord.postalAddresses.length === 0) {
      someRecord.postalAddresses.push({
        street: 'G-3, Shivam Apartment, Opp. Dholakiya Garden',
        city: 'Surat',
        state: 'GJ',
        region: 'GJ',
        postCode: '395004',
        country: 'India',
        label: 'work',
      });
    }
    someRecord.company = 'Premium Sales Corporation(Patel Computer)';
    console.log(someRecord, 'Record');
    Contacts.updateContact(someRecord, err => {
      console.log(err);
      // record updated
    });
  },

  getContact() {
    const newPerson = {
      company: 'Premium Sales Corporation(Patel Computer)',
      emailAddresses: [
        {
          label: 'work',
          email: 'psc@premiumitware.com',
        },
      ],
      familyName: 'Patel',
      givenName: 'Bhavesh',
      nickName: 'Bhavesh',
      middleName: '',
      phoneNumbers: [
        {
          label: 'mobile',
          number: '+919033685001',
        },
        {
          label: 'office',
          number: '0261-2480801',
        },
      ],
      postalAddresses: [
        {
          street: 'G-3, Shivam Apartment, Opp. Dholakiya Garden',
          city: 'Surat',
          state: 'GJ',
          region: 'GJ',
          postCode: '395004',
          country: 'India',
          label: 'work',
        },
      ],
    };

    Contacts.addContact(newPerson, err => {
      //if (err) throw err;
      console.log(err, 'Save successfully');
      // save successful
    });
  },
};

export default ContactsServiceHelper;
