import {Color, Matrics, Fonts, ApplicationStyles} from '../../common/styles';

export default styles = {
  container: {
    borderColor: Color.paleGreyTwo,
    padding: 5,
    backgroundColor: Color.white,
    margin: 5,
    borderRadius: 5,
  },
  font16Center: {fontSize: 16, textAlign: 'center'},
  bodyView: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 10,
  },
  square: {
    width: '10%',
    height: 20,
    borderWidth: 2,
    borderColor: Color.primary,
  },
  versionText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 16,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  viewVersion: {
    height: 50,
    justifyContent: 'center',
    paddingLeft: 20,
  },
};
