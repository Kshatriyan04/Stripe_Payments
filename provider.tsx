import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL, PurchasesPackage } from 'react-native-purchases';
import { CustomerInfo } from 'react-native-purchases';

// Use your RevenueCat API keys
export const APIKeys = {
	apple: '',
	google: 'goog_mPpvDhRpuZXsvZqYhhSDossJNGq'
};

interface RevenueCatProps {
	purchasePackage?: (pack: PurchasesPackage) => Promise<void>;
	restorePermissions?: () => Promise<CustomerInfo>;
	user: UserState;
	packages: PurchasesPackage[];
}

export interface UserState {
	cookies: number;
	items: string[];
	pro: boolean;
}

const RevenueCatContext = createContext<RevenueCatProps | null>(null);

// Export context for easy usage
export const useRevenueCat = () => {
	return useContext(RevenueCatContext) as RevenueCatProps;
};

// Provide RevenueCat functions to our app
export const RevenueCatProvider = ({ children }: any) => {
	const [user, setUser] = useState<UserState>({ cookies: 0, items: [], pro: false });
	const [packages, setPackages] = useState<PurchasesPackage[]>([]);
	const [isReady, setIsReady] = useState(false);
	// console.log({user, isReady});

	useEffect(() => {
		const init = async () => {
			if (Platform.OS === 'android') {
			console.log("init", APIKeys.google)
				await Purchases.configure({ apiKey: APIKeys.google, appUserID: "CustomerID2" });
			console.log("init2")
			console.log(await Purchases.isConfigured())


			} else {
				await Purchases.configure({ apiKey: APIKeys.apple });
			}
			setIsReady(true);

			// Use more logging during debug if want!
			Purchases.setLogLevel(LOG_LEVEL.DEBUG);

			// Listen for customer updates
			Purchases.addCustomerInfoUpdateListener(async (info) => {
				console.log("info",info);
				updateCustomerInformation(info);
			});
			console.log("====== getOfferings ==========")
			// Load all offerings and the user object with entitlements
			await loadOfferings();
		};
		init();
	}, []);

	// Load all offerings a user can (currently) purchase
	const loadOfferings = async () => {
		const prod = await Purchases.getProducts(["loot8_pack_10"]);
		// const prod2 = await Purchases.


		console.log(prod);
		const offerings = await Purchases.getOfferings();
		console.log("offerings ===========>")
		console.log(offerings);

		if (offerings.current) {
			setPackages(offerings.current.availablePackages);
		}
	};

	// Update user state based on previous purchases
	const updateCustomerInformation = async (customerInfo: CustomerInfo) => {

		const newUser: UserState = { cookies: user.cookies, items: [], pro: false };

		if (customerInfo?.entitlements.active['Epic Wand'] !== undefined) {
			newUser.items.push(customerInfo?.entitlements.active['Epic Wand'].identifier);
		}

		if (customerInfo?.entitlements.active['Magic Boots'] !== undefined) {
			newUser.items.push(customerInfo?.entitlements.active['Magic Boots'].identifier);
		}

		if (customerInfo?.entitlements.active['PRO Features'] !== undefined) {
			newUser.pro = true;
		}

		setUser(newUser);
	};

	// Purchase a package
	const purchasePackage = async (pack: PurchasesPackage) => {
		try {
			console.log("pack",pack);

			await Purchases.purchasePackage(pack);

			// Directly add our consumable product
			if (pack.product.identifier === 'loot8_pack_10') {
				setUser({ ...user, cookies: (user.cookies += 5) });
			}
		} catch (e: any) {
			// if (!e.userCancelled) {
				alert(e);
			// }
		}
	};

	// // Restore previous purchases
	const restorePermissions = async () => {
		const customer = await Purchases.restorePurchases();
		return customer;
	};

	const value = {
		restorePermissions,
		user,
		packages,
		purchasePackage
	};

	// Return empty fragment if provider is not ready (Purchase not yet initialised)
	if (!isReady) return <></>;

	return <RevenueCatContext.Provider value={value}>{children}</RevenueCatContext.Provider>;
};