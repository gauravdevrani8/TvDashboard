import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {WebView} from 'react-native-webview';
import Svg, {Path} from 'react-native-svg';
import {
  MultipleSelectList,
  SelectList,
} from 'react-native-dropdown-select-list';
import { Dimensions } from "react-native";
const { width } = Dimensions.get("window");


const BackIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5m7-7l-7 7 7 7" stroke="#45474B" strokeWidth={2} />
  </Svg>
);

function WebViewScreen({url, onBack}) {
  const [loading, setLoading] = useState(true);

  return (
    <View style={{flex: 1}}>
      {/* Back Button */}
      <View style={styles.absoluteButtonContainer}>
        <TouchableOpacity onPress={onBack} style={styles.absoluteButton}>
          <BackIcon />
        </TouchableOpacity>
      </View>

      {/* WebView with Loading Indicator */}
      <WebView
        source={{uri: url}}
        style={{flex: 1}}
        cacheEnabled={true}
        cacheMode="LOAD_CACHE_ELSE_NETWORK"
        startInLoadingState={true}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
      />

      {/* Loading Spinner */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      )}
    </View>
  );
}

function DashboardForm({onSubmit}) {
  const [unitOptions, setUnitOptions] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [processData, setProcessData] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [lineData, setLineData] = useState([]);
  const [selectedLine, setSelectedLine] = useState([]);
  // const [sectionData, setSectionData] = useState([]);
  // const [selectedSection, setSelectedSection] = useState(null);
  const [floorOptions, setFloorOptions] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(null);


  useEffect(() => {
    getUnit();
    fetchProcessesData();
    fetchTabLine();
    fetchFloorData(); //
  }, []);

  const getUnit = async () => {
    try {
      const {data} = await axios.get(
        'http://203.132.146.94:12001/analytics/dashboard/',
        {
          params: {call: 'get_unit'},
        },
      );
      const formattedUnits = data.data.map(unit => ({
        key: unit.id,
        value: unit.name,
      }));
      console.log('Units:', formattedUnits);
      setUnitOptions(formattedUnits);
    } catch (error) {
      console.error('Error fetching units data:', error);
    }
  };

  const fetchProcessesData = async () => {
    try {
      const response = await axios.get(
        'http://203.132.146.94:12001/rtqm/processes_master_view',
        {
          params: { plan_process: 'plan_all_process' },
        }
      );
      console.log('Processes Data:', response.data);
  
      setProcessData(
        response.data.pro_data.map(item => ({
          key: item.id,
          value: item.name,
        }))
      );
  
      console.log('newProcesses Data:', response.data);
      console.log(selectedProcess);
    } catch (err) {
      console.error('Error fetching processes data:', err);
    }
  };
    const fetchTabLine = async () => {
    try {
      const response = await axios.get(
        'http://203.132.146.94:12001/rtqm/qms_tab_login/',
      );
      setLineData(
        response.data.line_master_data.map(line => ({
          key: line.id,
          value: line.name,
        })),
      );
      console.log('Line Data:', response.data);
    } catch (error) {
      console.error('Error fetching line data:', error);
    }
  };

  // const fetchSectionData = async selectedValue => {
  //   setSelectedProcess(selectedValue);
  //   try {
  //     const response = await axios.get(
  //       `http://203.132.146.94:12001/rtqm/section_master_view/?id=${selectedValue}`,
  //     );
  //     setSectionData(
  //       response.data.sec_data.map(item => ({
  //         key: item.id,
  //         value: item.name,
  //       })),
  //     );
  //     console.log('Section Data:', response.data);
  //   } catch (err) {
  //     console.error('Failed to load section data:', err);
  //   }
  // };

  const fetchFloorData = async selectedValue => {
    setSelectedUnit(selectedValue);
    try {
      const response = await axios.get(
        `http://203.132.146.94:12001/rtqm/finishing_planing2/?unit_id=${selectedValue}`,
      );
      console.log('Floor Data:', response.data);
      setFloorOptions(
        response.data.common_master_data.map(item => ({
          key: item.id,
          value: item.name,
        })),
      );
    } catch (err) {
      console.error('Failed to load floor data:', err);
    }
  };

  const handleSubmit = async () => {
    let url = '';
    const selectedLinesString = selectedLine.join(',');

    if (selectedProcess === 7 || selectedProcess === 8) {
      url = `http://203.132.146.94:12001/rtqm/cutting_dashboard1/?line_id=${selectedLinesString}&process_id=${selectedProcess}&unit_id=${selectedUnit}&floor_id=${selectedFloor}`;
    } else if (selectedProcess === 5) {
      url = `http://203.132.146.94:11005/tv/dashboard/?line_id=${selectedLinesString}&process_id=${selectedProcess}&section_id=7&unit_id=${selectedUnit}`;
    } else if (selectedProcess === 6) {
      url = `http://203.132.146.94:11005/tv/ftdashboard/?line_id=${selectedLinesString}&process_id=${selectedProcess}&section_id=9&unit_id=${selectedUnit}`;
    } 
  
    console.log('Generated URL:', url);

    // Save the form data to AsyncStorage
    try {
      await AsyncStorage.setItem(
        'formData',
        JSON.stringify({
          url,
          selectedProcess,
          selectedUnit,
          selectedLine,
          // selectedSection,
          selectedFloor,
        }),
      );
    } catch (err) {
      console.error('Error saving form data:', err);
    }

    onSubmit(url);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo/finelines.png')}
        style={styles.logoAbsolute}
      />

      <Text style={styles.header}>TV Dashboards</Text>

      <View style={styles.gridContainer}>
        <View style={styles.gridItem}>
          <Text style={styles.label}>Select a Process:</Text>
          <SelectList
            setSelected={setSelectedProcess}
            data={processData}
            placeholder="Select Process"
            save="key"
            dropdownStyles={styles.dropdownBadgeStyles}
            defaultOption={null}
            search={true}
            // onSelect={() => fetchSectionData(selectedProcess)}
          />
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.label}>Select a Unit:</Text>
          <SelectList
            setSelected={setSelectedUnit}
            data={unitOptions}
            placeholder="Select Unit"
            save="key"
            search={true}
            dropdownStyles={styles.dropdownBadgeStyles}
            onSelect={() => fetchFloorData(selectedUnit)}
          />
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.label}>Select Lines:</Text>
          <MultipleSelectList
            setSelected={setSelectedLine}
            data={lineData}
            save="key"
            label="value"
            multiple={true}
            placeholder="Select Lines"
            badgeStyles={{backgroundColor: '#007BFF'}}
            badgeTextStyles={{color: '#fff'}}
            dropdownStyles={styles.dropdownBadgeStyles}
          />
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.label}>Select a Floor:</Text>
          <SelectList
            setSelected={setSelectedFloor}
            data={floorOptions}
            placeholder="Select Floor"
            save="key"
            dropdownStyles={styles.dropdownBadgeStyles}
            search={true}
          />
        </View>
        <View style={styles.submitButtonWrapper}>
  <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
    <Text style={styles.buttonText}>Submit</Text>
  </TouchableOpacity>
</View>
      </View>
    </View>
  );
}

export default function App() {
  const [webviewUrl, setWebviewUrl] = useState('');
  const [showWebView, setShowWebView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadPreviousData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('formData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setWebviewUrl(parsedData.url);
        setShowWebView(true);
      }
    } catch (err) {
      console.error('Error loading previous data:', err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadPreviousData();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return showWebView ? (
    <WebViewScreen url={webviewUrl} onBack={() => setShowWebView(false)} />
  ) : (
    <DashboardForm
      onSubmit={url => {
        setWebviewUrl(url);
        setShowWebView(true);
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F3',
    padding: '7%',
  },
  submitButtonWrapper: {
    marginTop: 27,
    width: '100%',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#E07A5F', // Green color
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30, // Fully rounded
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%', // Adjust width as needed
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // For Android shadow effect
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  logoAbsolute: {
    position: 'absolute',
    top: 10,
    left: 25,
    width: 55,
    padding: 20,
    height: 55,
    resizeMode: 'contain',
  },
  header: {
    fontSize: 20,
    padding: 10,
    position: 'relative',
    fontWeight: 'bold',
    borderBlockColor: 'rgba(19, 249, 58, 0.94)',
    color: '#E07A5F',
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#3F4F44',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '400',
    marginVertical: 6,
    color: '#9694FF',
  },
  gridContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: width > 600 ? "20%" : "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  absoluteButtonContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 1,
    borderRadius: 50,
    shadowColor: '#000',
    shadowRadius: 10,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgb(255, 255, 255)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dropdownStyles: {
    backgroundColor: '#fff',
    borderRadius: 1,
    padding: 10,

  },
  dropdownBadgeStyles: {
    backgroundColor: '#DBE9B7',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    elevation: 3,
    shadowRadius: 2,
    


  },
});
