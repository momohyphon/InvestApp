import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { db } from './firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';

// 컴포넌트 import
import GlobalFinance from './GlobalFinance';
import KRNews from './KRNews';
import KRTable from './KRTable';
import KRGraphTrend from './KRGraphTrend';
import USNews from './USNews';
import USTable from './USTable';
import USGraphTrend from './USGraphTrend';

export default function App() {
  const [activeTab, setActiveTab] = useState('FINANCE');
  const [krSubTab, setKrSubTab] = useState('뉴스'); // 뉴스를 기본으로
  const [usSubTab, setUsSubTab] = useState('뉴스'); // 뉴스를 기본으로
  const [financeData, setFinanceData] = useState(null);
  const [krNewsData, setKrNewsData] = useState(null);
  const [usNewsData, setUsNewsData] = useState(null);
  const [krRsData, setKrRsData] = useState(null); // 한국 RS 데이터
  const [usRsData, setUsRsData] = useState(null); // 미국 RS 데이터

  useEffect(() => {
    // Finance 데이터
    const unsubFinance = onSnapshot(doc(db, 'market_data', 'global_indices'), (d) => {
      if (d.exists()) setFinanceData(d.data());
    });

    // 한국 뉴스
    const unsubKrNews = onSnapshot(doc(db, 'stock_news', 'news_kr'), (d) => {
      if (d.exists()) setKrNewsData(d.data());
    });

    // 미국 뉴스
    const unsubUsNews = onSnapshot(doc(db, 'stock_news', 'news_us'), (d) => {
      if (d.exists()) setUsNewsData(d.data());
    });

    // 한국 RS 데이터
    const unsubKrRs = onSnapshot(doc(db, 'rs_data', 'latest'), (d) => {
      if (d.exists()) setKrRsData(d.data());
    });

    // 미국 RS 데이터
    const unsubUsRs = onSnapshot(doc(db, 'rs_data', 'us_latest'), (d) => {
      if (d.exists()) setUsRsData(d.data());
    });

    return () => {
      unsubFinance();
      unsubKrNews();
      unsubUsNews();
      unsubKrRs();
      unsubUsRs();
    };
  }, []);

  const renderKoreaContent = () => {
    switch (krSubTab) {
      case '뉴스':
        return krNewsData && krRsData ? <KRNews data={krNewsData} rsData={krRsData} /> : <LoadingView />;
      case 'RS지표':
        return <KRTable />;
      case 'RS그래프':
        return <KRGraphTrend />;
      default:
        return <LoadingView />;
    }
  };

  const renderUSAContent = () => {
    switch (usSubTab) {
      case '뉴스':
        return usNewsData && usRsData ? <USNews data={usNewsData} rsData={usRsData} /> : <LoadingView />;
      case 'RS지표':
        return <USTable />;
      case 'RS그래프':
        return <USGraphTrend />;
      default:
        return <LoadingView />;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'FINANCE':
        return financeData ? <GlobalFinance data={financeData} /> : <LoadingView />;
      
      case 'KOREA':
        return (
          <View style={styles.tabContent}>
            {/* 서브 탭 */}
            <View style={styles.subTabBar}>
              <TouchableOpacity
                style={[styles.subTab, krSubTab === '뉴스' && styles.subTabActive]}
                onPress={() => setKrSubTab('뉴스')}
              >
                <Text style={[styles.subTabText, krSubTab === '뉴스' && styles.subTabTextActive]}>
                  뉴스
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.subTab, krSubTab === 'RS지표' && styles.subTabActive]}
                onPress={() => setKrSubTab('RS지표')}
              >
                <Text style={[styles.subTabText, krSubTab === 'RS지표' && styles.subTabTextActive]}>
                  RS지표
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.subTab, krSubTab === 'RS그래프' && styles.subTabActive]}
                onPress={() => setKrSubTab('RS그래프')}
              >
                <Text style={[styles.subTabText, krSubTab === 'RS그래프' && styles.subTabTextActive]}>
                  RS그래프
                </Text>
              </TouchableOpacity>
            </View>
            {renderKoreaContent()}
          </View>
        );
      
      case 'USA':
        return (
          <View style={styles.tabContent}>
            {/* 서브 탭 */}
            <View style={styles.subTabBar}>
              <TouchableOpacity
                style={[styles.subTab, usSubTab === '뉴스' && styles.subTabActive]}
                onPress={() => setUsSubTab('뉴스')}
              >
                <Text style={[styles.subTabText, usSubTab === '뉴스' && styles.subTabTextActive]}>
                  뉴스
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.subTab, usSubTab === 'RS지표' && styles.subTabActive]}
                onPress={() => setUsSubTab('RS지표')}
              >
                <Text style={[styles.subTabText, usSubTab === 'RS지표' && styles.subTabTextActive]}>
                  RS지표
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.subTab, usSubTab === 'RS그래프' && styles.subTabActive]}
                onPress={() => setUsSubTab('RS그래프')}
              >
                <Text style={[styles.subTabText, usSubTab === 'RS그래프' && styles.subTabTextActive]}>
                  RS그래프
                </Text>
              </TouchableOpacity>
            </View>
            {renderUSAContent()}
          </View>
        );
      
      default:
        return <LoadingView />;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Finance Summary</Text>
        </View>

        {/* 탭 네비게이션 */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'FINANCE' && styles.tabActive]}
            onPress={() => setActiveTab('FINANCE')}
          >
            <Text style={[styles.tabText, activeTab === 'FINANCE' && styles.tabTextActive]}>
              FINANCE
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'KOREA' && styles.tabActive]}
            onPress={() => setActiveTab('KOREA')}
          >
            <Text style={[styles.tabText, activeTab === 'KOREA' && styles.tabTextActive]}>
              KOREA
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'USA' && styles.tabActive]}
            onPress={() => setActiveTab('USA')}
          >
            <Text style={[styles.tabText, activeTab === 'USA' && styles.tabTextActive]}>
              USA
            </Text>
          </TouchableOpacity>
        </View>

        {/* 컨텐츠 영역 */}
        <View style={styles.content}>
          {renderContent()}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const LoadingView = () => (
  <View style={styles.loadingContainer}>
    <Text style={styles.loadingText}>데이터 로딩 중...</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    backgroundColor: '#000',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#ff6b00',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  tabTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    backgroundColor: '#000',
  },
  subTabBar: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  subTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  subTabActive: {
    borderBottomColor: '#ff6b00',
  },
  subTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  subTabTextActive: {
    color: '#ff6b00',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
});