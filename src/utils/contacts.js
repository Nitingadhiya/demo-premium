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
                    number: '+919033685001' || '9033685001' || '(903) 368-5001',
                  },
                ],
              });

              if (findI > -1) {
                this.updateContact(contacts, findI);
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

  updateContact(cont, findI) {
    let someRecord = [];
    someRecord = cont[findI];

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
