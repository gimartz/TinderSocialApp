import {useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Color scheme
const colors = {
  primary: '#FFC107',
  primaryDark: '#FFA000',
  background: '#FFFDE7',
  surface: '#FFFFFF',
  text: '#2E2E2E',
  textSecondary: '#616161',
  error: '#E53935',
  border: '#FFE082',
  placeholder: '#9E9E9E',
};

// Custom Category Selector Component
const CategorySelector = ({
  categories,
  selectedIds,
  onSelect,
  loading,
  onRefresh,
}: {
  categories: Array<{id: string; name: string; icon?: string}>;
  selectedIds: string[];
  onSelect: (ids: string[]) => void;
  loading: boolean;
  onRefresh: () => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleCategory = (categoryId: string) => {
    const newSelection = selectedIds.includes(categoryId)
      ? selectedIds.filter(id => id !== categoryId)
      : [...selectedIds, categoryId];
    onSelect(newSelection);
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <View style={customStyles.selectorContainer}>
      <View style={customStyles.header}>
        <Text style={[customStyles.label, {color: colors.text}]}>
          {/* Restaurant Categories */}
        </Text>
        <TouchableOpacity
          onPress={onRefresh}
          disabled={loading}
          style={customStyles.refreshButton}>
          {loading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text style={[customStyles.refreshText, {color: colors.primary}]}>
              Refresh
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={[customStyles.infoText, {color: colors.textSecondary}]}>
        Select categories that describe your restaurant
      </Text>

      {loading && !categories.length ? (
        <View style={customStyles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text
            style={[customStyles.loadingText, {color: colors.textSecondary}]}>
            Loading categories...
          </Text>
        </View>
      ) : (
        <>
          <TouchableOpacity
            style={[
              customStyles.dropdownToggle,
              {borderColor: colors.border, backgroundColor: colors.surface},
            ]}
            onPress={() => setIsExpanded(!isExpanded)}>
            <Text style={{color: colors.text}}>
              {selectedIds.length > 0
                ? `${selectedIds.length} categories selected`
                : 'Select categories'}
            </Text>
            <Text style={{color: colors.text}}>{isExpanded ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {isExpanded && (
            <View
              style={[
                customStyles.dropdownContent,
                {backgroundColor: colors.surface, borderColor: colors.border},
              ]}>
              <TextInput
                placeholder="Search categories..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={[
                  customStyles.searchInput,
                  {backgroundColor: colors.surface, color: colors.text},
                ]}
                underlineColorAndroid="transparent"
              />

              <ScrollView
                style={customStyles.scrollContainer}
                nestedScrollEnabled={true}>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map(category => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        customStyles.categoryItem,
                        {
                          backgroundColor: selectedIds.includes(category.id)
                            ? colors.background
                            : colors.surface,
                        },
                      ]}
                      onPress={() => toggleCategory(category.id)}>
                      <Text style={{color: colors.text}}>
                        {category.icon ? `${category.icon} ` : ''}
                        {category.name}
                      </Text>
                      {selectedIds.includes(category.id) && (
                        <Text style={{color: colors.primary}}>✓</Text>
                      )}
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text
                    style={[
                      customStyles.noResults,
                      {color: colors.textSecondary},
                    ]}>
                    No categories found
                  </Text>
                )}
              </ScrollView>
            </View>
          )}

          {selectedIds.length > 0 && (
            <View style={customStyles.selectedContainer}>
              <Text style={[customStyles.selectedLabel, {color: colors.text}]}>
                Selected:
              </Text>
              <View style={customStyles.selectedItems}>
                {selectedIds.map(id => {
                  const category = categories.find(c => c.id === id);
                  return category ? (
                    <View
                      key={id}
                      style={[
                        customStyles.selectedTag,
                        {
                          borderColor: colors.border,
                          backgroundColor: colors.background,
                        },
                      ]}>
                      <Text style={{color: colors.text}}>
                        {category.icon ? `${category.icon} ` : ''}
                        {category.name}
                      </Text>
                    </View>
                  ) : null;
                })}
              </View>
            </View>
          )}
        </>
      )}
    </View>
  );
};

// Custom Styles
const customStyles = StyleSheet.create({
  selectorContainer: {
    marginTop: 20,
    marginBottom: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  infoText: {
    fontSize: 14,
    marginBottom: 10,
    fontFamily: 'Inter-Regular',
  },
  refreshButton: {
    padding: 6,
    borderRadius: 4,
  },
  refreshText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  dropdownToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  dropdownContent: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    maxHeight: 200,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontFamily: 'Inter-Regular',
  },
  scrollContainer: {
    maxHeight: 150,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  noResults: {
    textAlign: 'center',
    padding: 10,
    fontFamily: 'Inter-Regular',
  },
  selectedContainer: {
    marginTop: 10,
  },
  selectedLabel: {
    fontSize: 14,
    marginBottom: 5,
    fontFamily: 'Inter-Medium',
  },
  selectedItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
});

export default CategorySelector;
