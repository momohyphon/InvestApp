import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { db } from './firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';

const { width } = Dimensions.get('window');

const USTable = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'rs_data', 'us_latest'), (docSnapshot) => {
      if (docSnapshot.exists()) setData(docSnapshot.data());
    });
    return () => unsub();
  }, []);

  if (!data || !data.rankings) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>데이터 로딩 중...</Text>
      </View>
    );
  }

  // 히트맵을 위한 그리드 계산 (상위 40개만)
  const topStocks = data.rankings.slice(0, 40);
  const gridSize = Math.ceil(Math.sqrt(topStocks.length));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.mainTitle}>USA RS HEATMAP & ANALYSIS</Text>

      {/* 히트맵 그리드 */}
      <View style={styles.heatmapContainer}>
        {topStocks.map((item, idx) => {
          const bgColor = item.rs_avg >= 75 ? '#2ecc71' : '#ff4d94';
          return (
            <View 
              key={idx} 
              style={[
                styles.heatmapCell,
                { 
                  backgroundColor: bgColor,
                  width: (width - 40) / gridSize,
                  height: (width - 40) / gridSize,
                }
              ]}
            >
              <Text style={styles.cellName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.cellScore}>{item.rs_avg}</Text>
            </View>
          );
        })}
      </View>

      {/* 데이터 테이블 */}
      <View style={styles.tableContainer}>
        {/* 헤더 */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, { width: 40 }]}>RK</Text>
          <Text style={[styles.headerCell, { width: 70 }]}>CODE</Text>
          <Text style={[styles.headerCell, { width: 100, textAlign: 'left' }]}>NAME</Text>
          <Text style={[styles.headerCell, { width: 45 }]}>180D</Text>
          <Text style={[styles.headerCell, { width: 45 }]}>90D</Text>
          <Text style={[styles.headerCell, { width: 45 }]}>60D</Text>
          <Text style={[styles.headerCell, { width: 45 }]}>30D</Text>
          <Text style={[styles.headerCell, { width: 45 }]}>10D</Text>
          <Text style={[styles.headerCell, { width: 50 }]}>AVG</Text>
        </View>

        {/* 데이터 행들 */}
        {data.rankings.map((s, idx) => (
          <View key={idx} style={styles.tableRow}>
            <Text style={[styles.cell, { width: 40 }]}>{idx + 1}</Text>
            <Text style={[styles.cell, { width: 70 }]}>{s.code}</Text>
            <Text style={[styles.cell, { width: 100, fontWeight: 'bold', textAlign: 'left' }]} numberOfLines={1}>
              {s.name}
            </Text>
            <Text style={[styles.cell, { width: 45 }]}>{s.rs_180}</Text>
            <Text style={[styles.cell, { width: 45 }]}>{s.rs_90}</Text>
            <Text style={[styles.cell, { width: 45 }]}>{s.rs_60}</Text>
            <Text style={[styles.cell, { width: 45 }]}>{s.rs_30}</Text>
            <Text style={[styles.cell, { width: 45 }]}>{s.rs_10}</Text>
            <Text 
              style={[
                styles.cell, 
                { width: 50, fontWeight: '900', color: s.rs_avg >= 75 ? '#2ecc71' : '#ff6b00' }
              ]}
            >
              {s.rs_avg}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    padding: 20,
  },
  mainTitle: {
    color: '#ff6b00',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 15,
  },
  heatmapContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'center',
  },
  heatmapCell: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
  },
  cellName: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'center',
  },
  cellScore: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
  },
  tableContainer: {
    marginTop: 20,
    borderTopWidth: 2,
    borderTopColor: '#ff6b00',
    paddingHorizontal: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#ff6b00',
  },
  headerCell: {
    color: '#ff6b00',
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    alignItems: 'center',
  },
  cell: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default USTable;
