document.addEventListener("DOMContentLoaded", () => {
	appendModal = (curr, customArray, wishlistProducts, handle) => {
		let modal = `<div class="removepopup-main-wrapper remove-popup">
			<div class="popup-wrapper">
				<div class="popup-header">
					<p>取り除く</p>
					<span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></span>
				</div>
				<div class="popup-body">
					<p>製品をウィッシュリストから削除してもよろしいですか?</p>
				</div>
				<div class="popup-footer">
					<div class="popup-footer-btn">
						<div class="popupbtn cancel">キャンクル</div>
						<div class="popupbtn delete">取り除く</div>
					</div> 
				</div>
			</div>
		</div>`;
		element = appendElementInHtml(modal);
		document.querySelector('body').insertAdjacentElement('afterbegin', element);
		document.querySelector('.popupbtn.cancel').addEventListener('click', () => {
			document.querySelector('.removepopup-main-wrapper').remove();
		});
		document.querySelector('.lucide.lucide-x').addEventListener('click', () => {
			document.querySelector('.removepopup-main-wrapper').remove();
		});
		document.querySelector('.popupbtn.delete').addEventListener('click', () => {
			if (customArray[0].categorised == '1') {
				let category = curr.getAttribute('data-cat'),
					updatedWishlist = removeObjectsByHandle(wishlistProducts, category, handle);
				localStorage.setItem('wishlistProducts', JSON.stringify(updatedWishlist));
				document.querySelector(`.popup-content-main[data-handle="${handle}"]`).remove();
				if (document.querySelectorAll(`.popup-content-main.category[data-cat="${category}"] .popup-content-main`).length == 0) {
					document.querySelector(`.popup-content-main.category[data-cat="${category}"]`).remove();
				}
			} else {
				document.querySelector(`.wishlistBtn[pro_handle="${handle}"] svg`).setAttribute('fill', '#a7acb1');
				document.querySelector(`.wishlistBtn[pro_handle="${handle}"] svg`).classList.remove('addedtowishlist_icon');
				document.querySelector(`.popup-content-main[data-handle="${handle}"]`).remove();
				filteredArray = originalArray.filter(item => item.pro_handle !== productHandleToRemove);
			}
			document.querySelector('.removepopup-main-wrapper').remove();
			appendToast('Removed', false);
		});
	}

	customizedPopup = (currVar, wishlistCategorys, productHandle, productId, customArray) => {
		let caterizedPopup = `<div class="popup popup-active">
			<div class="popup-overlay popup-toggle"></div>
			<div class="popup-main-wrapper mag-category-popup">
				<div class="popup-wrapper popup-transition">
					<div class="popup-header">
						<button class="popup-close popup-toggle">
							<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
								<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
							</svg>
						</button>
						<h2 class="popup-heading">Category</h2>
					</div>
					<div class="popup-body">
						<div class="popup-content">
							<div class='popup-content-main'>
								<div class="mag-create-new-category-wrapper">
									<div class="mag-create-new-category">Create new category</div>
								</div>
								<form id="mag-create-category" class="mag-create-category hide">
									<div class="mag-category-form">
										<div class="input-wrapper">
										 <input type="text" placeholder="Category name" name="categoryName" />
											<div class="button-wrapper active">
												<input type="submit" value="">
													<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/></svg>
											</div>
									 </div>
										<div class="mag-cat-exist"></div>
									</div>
								</form>
								<div class="mag-popup-pro-url">
									${(wishlistCategorys.length > 0)
				? `<div class="mag-categorys-wrapper">
									${wishlistCategorys.map((cat, index) => `<div class="mag-category-name" data-category="${cat}"><input type="checkbox" name="mag-category" id="mag-category-${index}" data-cat="${cat}"><label for="mag-category-${index}">${cat}</label>
									</div>`).join('')}
								</div>`
				: `<div class="mag-no-categorys">
										利用可能なカテゴリがありません
									</div>` }
								</div>
						</div>
					</div>
					<div class='popup-content-main footer'>
						<div class="mag-popup-pro-url">
							<div class="mag-popup-pro-action">
								<button class="mag-view-wishlist btn button">ウィッシュリストを見る</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>`;
		if (document.querySelector('.popup.popup-active')) {
			document.querySelector('.popup.popup-active').remove();
		}
		let htmlBtnElement = appendElementInHtml(caterizedPopup);
		document.querySelector('body').insertAdjacentElement('afterbegin', htmlBtnElement);
		document.querySelector('.mag-view-wishlist').addEventListener('click', () => {
			wishlistButton.click();
		});
		document.querySelector('.popup-close.popup-toggle').addEventListener('click', () => {
			document.querySelector('.popup.popup-active').remove();
		});
		createNewCategory();
		// addProductToCategory(currVar, productHandle, productId, customArray);
		addProToCategory(currVar, productHandle, productId, customArray);

		let category = document.querySelector('#mag-create-category');
		category.addEventListener('submit', (e) => {
			e.preventDefault();
			let categoryName = document.querySelector('[name="categoryName"]').value,
				categoryWrapper = document.querySelector('.mag-categorys-wrapper'),
				categoryExist = catExistOrNot(wishlistProducts, categoryName),
				currDate = Date.now();
			if (categoryWrapper) {
				if (categoryName.trim() == '') {
					document.querySelector('.mag-cat-exist').innerHTML = "カテゴリを空白にすることはできません。";
				} else if (categoryExist !== -1) {
					document.querySelector('.mag-cat-exist').innerHTML = 'カテゴリはすでに存在します。';
				} else {
					document.querySelector('.mag-cat-exist').innerHTML = '';
					// let catElement = appendElementInHtml(`<div class="mag-category-name" data-category="${categoryName}">${categoryName}</div>`);
					let catElement = appendElementInHtml(`<div class="mag-category-name" data-category="${categoryName}"><input type="checkbox" name="mag-category" id="mag-category-${currDate}" data-cat="${categoryName}"><label for="mag-category-${currDate}">${categoryName}</label></div>`);
					addCatToLocalStorage(wishlistProducts, categoryName);
					categoryWrapper.insertAdjacentElement('beforeend', catElement);
					addProToCategoryOnId(currDate, currVar, productHandle, productId, customArray);
					category.reset();
				}
			} else {
				if (categoryName.trim() == '') {
					document.querySelector('.mag-cat-exist').innerHTML = "カテゴリを空白にすることはできません。";
				} else {
					document.querySelector('.mag-cat-exist').innerHTML = '';
					let catElement = `<div class="mag-categorys-wrapper">
						<div class="mag-category-name" data-category="${categoryName}">
							<input type="checkbox" name="mag-category" id="mag-category-${currDate}" data-cat="${categoryName}">
							<label for="mag-category-${currDate}">${categoryName}</label>
						</div>
					</div>`;
					document.querySelector('.mag-popup-pro-url').innerHTML = catElement;
					addCatToLocalStorage(wishlistProducts, categoryName);
					addProToCategoryOnId(currDate, currVar, productHandle, productId, customArray);
					category.reset();
				}
			}
			// addProductToCategory(currVar, productHandle, productId, customArray);
			// addProToCategory(currVar, productHandle, productId, customArray);
		});
	}

	addWishListButtonToCollectionPage = (customArray) => {
		let wishlist = (window.myappgurus.wishlist.target_class != '') ? document.querySelectorAll(`${window.myappgurus.wishlist.target_class}`) : document.querySelectorAll('.card__heading.h5');
		if (wishlist.length > 0) {
			wishlist.forEach(curr => {
				let productHandle = curr.querySelector('a').getAttribute('href')?.split('/products/')[1],
					isExist = (customArray[0].categorised == '1') ? isCatHandleExist(wishlistProducts, productHandle) : isHandleExist(wishlistProducts, productHandle);
				if (productHandle != undefined) {
					if (isExist) {
						var fill_color;

						if (__st.a == '80546955604') {
							fill_color = "black";
						} else {
							fill_color = "red";
						}
						var wishlistBtn = `<div class='mag_wishlist btn_collection-grid'>
								<div class='wishlistBtn addedtowishlist_icon' id='addedToWishlistCollectionIcon' pro_handle='${productHandle}'>
										<svg xmlns="http://www.w3.org/2000/svg" fill="${fill_color}" width="25" height="25" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
												<path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
										</svg>
								</div>
						</div>`;
					} else {
						var wishlistBtn = `<div class='mag_wishlist  btn_collection-grid'>
							<div class='wishlistBtn' id='addToWishlistCollectionIcon' pro_handle='${productHandle}'>
								<svg xmlns="http://www.w3.org/2000/svg" fill="#a7acb1" width="25" height="25" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
									<path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
								</svg>
							</div>
						</div>`;
					}
					let wishlistBtnElement = appendElementInHtml(wishlistBtn);
					curr.insertAdjacentElement('afterbegin', wishlistBtnElement);
				}
			});
			addWishlistBtn(customArray);
			// removeWishlistBtn(customArray);
		}
	}

	addWishlistBtn = (customArray) => {
		let wishlistBtn = document.querySelectorAll('.wishlistBtn');
		wishlistBtn.forEach(curr => {
			let productHandle = decodeURI(curr.getAttribute('pro_handle'));

			curr.addEventListener('click', () => {
				if (curr.classList.contains('addedtowishlist_icon')) {
					removeProductClick(curr.getAttribute('pro_handle'), customArray);
					curr.querySelector('svg').setAttribute('fill', '#a7acb1');
					curr.classList.remove('addedtowishlist_icon');
					if (customerId != undefined) {
						saveWishlistProducts(domain, wishlistProducts, customerId, shopName, shopId);
					}
					// addWishlistBtn();
				} else {
					if ((customArray[0].allow_guest == '0' || customArray[0].allow_guest == null) && customerId == undefined) {
						window.location.href = '/account/login';
					} else {
						fetch(`/products/${productHandle}.json`)
							.then(res => res.json())
							.then(response => {
								let wishlistCategorys = wishlistProducts.reduce((categories, item) => {
									let category = Object.keys(item)[0],
										values = Object.values(item)[0];
									if (Array.isArray(values)) {
										categories.push(category);
									}
									return categories;
								}, []);
								let productId = response.product.id;
								if (customArray[0].categorised == '1') {
									customizedPopup(curr, wishlistCategorys, productHandle, productId, customArray);
								} else {
									if (!curr.classList.contains('addedtowishlist_icon')) {
										wishlistProducts.push({ "pro_handle": productHandle, "pro_id": productId });
										localStorage.setItem('wishlistProducts', JSON.stringify(wishlistProducts));
										if (__st.a == '80546955604') {
											curr.querySelector('svg').setAttribute('fill', 'black');
										} else {
											curr.querySelector('svg').setAttribute('fill', 'red');
										}
										// curr.querySelector('svg').setAttribute('fill', 'black');
										curr.classList.add('addedtowishlist_icon');
										setWishlistProductCount(wishlistProducts, customArray);
										if (customerId != undefined) {
											saveWishlistProducts(domain, wishlistProducts, customerId, shopName, shopId);
										}
									}
								}
							})
					}
				}
			});
		});
	}

	createNewCategory = () => {
		let createCategoryBtn = document.querySelector('.mag-create-new-category');
		if (createCategoryBtn) {
			createCategoryBtn.addEventListener('click', () => {
				document.querySelector('form#mag-create-category').classList.toggle('hide');
			});
		}
	}

	addProToCategory = (currCat, productHandle, productId, customArray) => {
		let categoryNameBtn = document.querySelectorAll('[name="mag-category"]');
		if (categoryNameBtn) {
			categoryNameBtn.forEach(curr => {
				curr.addEventListener('change', () => {
					let categoryName = curr.getAttribute('data-cat'),
						existingCategoryIndex = catExistOrNot(wishlistProducts, categoryName);
					if (curr.checked == true) {
						if (existingCategoryIndex !== -1) {
							wishlistProducts[existingCategoryIndex][categoryName].push({ "pro_handle": productHandle, "pro_id": productId });
						} else {
							wishlistProducts.push({ [categoryName]: [{ "pro_handle": productHandle, "pro_id": productId }] });
						}
						localStorage.setItem('wishlistProducts', JSON.stringify(wishlistProducts));
						if (currCat != null) {
							currCat.querySelector('svg').setAttribute('fill', 'red');
							currCat.classList.add('addedtowishlist_icon');
							setWishlistProductCount(wishlistProducts, customArray);
							if (customerId != undefined) {
								saveWishlistProducts(domain, wishlistProducts, customerId, shopName, shopId);
							}
						} else {
							let wishListButton = `<div class='mag_wishlist'>
								<a href='javascript:void(0)' class='view-wishlist button'>
								<svg xmlns="http://www.w3.org/2000/svg" fill="${(JSON.parse(customArray[0].wishlist_color_after) != null) ? hsbToHex(JSON.parse(customArray[0].wishlist_color_after)) : customArray[0].wishlist_color_after}" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
								<path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
								</svg>
									${customArray[0].text_for_view_to_wishlist}
								</a>
							</div>`;
							document.querySelector('.mag-pdp-wishlist').innerHTML = wishListButton;
							setWishlistProductCount(wishlistProducts, customArray);
						}
					} else {
						let filteredArray = wishlistProducts.filter(item => {
							let cat = Object.values(item)[0];
							if (Object.keys(item)[0] == categoryName) {
								if (Array.isArray(cat)) {
									let index = cat.findIndex(p => p.pro_handle === productHandle);
									if (index != -1) {
										cat.splice(index, 1);
									}
								}
							}
							return true;
						});
						wishlistProducts = filteredArray;
						localStorage.setItem('wishlistProducts', JSON.stringify(wishlistProducts));
						setWishlistProductCount(wishlistProducts, customArray);
					}
				});
			});
		}
	}

	addProToCategoryOnId = (id, currCat, productHandle, productId, customArray) => {
		let categoryNameBtn = document.querySelector(`#mag-category-${id}`);
		if (categoryNameBtn) {
			categoryNameBtn.addEventListener('change', () => {
				let categoryName = categoryNameBtn.getAttribute('data-cat'),
					existingCategoryIndex = catExistOrNot(wishlistProducts, categoryName);
				if (categoryNameBtn.checked == true) {
					if (existingCategoryIndex !== -1) {
						wishlistProducts[existingCategoryIndex][categoryName].push({ "pro_handle": productHandle, "pro_id": productId });
					} else {
						wishlistProducts.push({ [categoryName]: [{ "pro_handle": productHandle, "pro_id": productId }] });
					}
					localStorage.setItem('wishlistProducts', JSON.stringify(wishlistProducts));
					if (currCat != null) {
						currCat.querySelector('svg').setAttribute('fill', 'red');
						currCat.classList.add('addedtowishlist_icon');
						setWishlistProductCount(wishlistProducts, customArray);
						if (customerId != undefined) {
							saveWishlistProducts(domain, wishlistProducts, customerId, shopName, shopId);
						}
					} else {
						let wishListButton = `<div class='mag_wishlist'>
							<a href='javascript:void(0)' class='view-wishlist button'>
								${customArray[0].text_for_view_to_wishlist}
							</a>
						</div>`;
						document.querySelector('.mag-pdp-wishlist').innerHTML = wishListButton;
						setWishlistProductCount(wishlistProducts, customArray);
					}
				} else {
					wishlistProducts[categoryName].findIndex(p => p.pro_handle === productHandle);
					if (index != -1) {
						cat.splice(index, 1);
					}
					wishlistProducts = filteredArray;
					localStorage.setItem('wishlistProducts', JSON.stringify(wishlistProducts));
					setWishlistProductCount(wishlistProducts, customArray);
				}
			});
		}
	}

	// var addProductToCategory = (currCat, productHandle, productId, customArray) => {
	// 	let categoryNameBtn = document.querySelectorAll('.mag-category-name');
	// 	if (categoryNameBtn) {
	// 		categoryNameBtn.forEach(curr => {
	// 			curr.addEventListener('click', () => {
	// 				let categoryName = curr.getAttribute('data-category'),
	// 						existingCategoryIndex = catExistOrNot(wishlistProducts, categoryName);
	// 				if (existingCategoryIndex !== -1) {
	// 					wishlistProducts[existingCategoryIndex][categoryName].push({"pro_handle": productHandle, "pro_id": productId});
	// 				} else {
	// 					wishlistProducts.push({[categoryName] : [{"pro_handle": productHandle, "pro_id": productId}]});
	// 				}
	// 				localStorage.setItem('wishlistProducts', JSON.stringify(wishlistProducts));
	// 				if (currCat != null) {
	// 					currCat.querySelector('svg').setAttribute('fill', 'orange');
	// 					currCat.classList.add('addedtowishlist_icon');
	// 					setWishlistProductCount(wishlistProducts, customArray);
	// 					if (customerId != undefined) {
	// 						saveWishlistProducts(domain, wishlistProducts, customerId, shopName, shopId);
	// 					}
	// 					document.querySelector('.popup.popup-active').remove();
	// 				} else {
	// 					let wishListButton = `<div class='mag_wishlist'>
	// 						<a href='javascript:void(0)' class='view-wishlist button'>
	// 							${customArray[0].text_for_view_to_wishlist}
	// 						</a>
	// 					</div>`;
	// 					document.querySelector('.mag-pdp-wishlist').innerHTML = wishListButton;
	// 					setWishlistProductCount(wishlistProducts, customArray);
	// 					document.querySelector('.popup.popup-active').remove();
	// 				}
	// 			});
	// 		});
	// 	}
	// }

	// var removeWishlistBtn = (customArray) => {
	// 	let wishlistBtn = document.querySelectorAll('.wishlistBtn.addedtowishlist_icon');
	// 	if (wishlistBtn) {
	// 		wishlistBtn.forEach(curr => {
	// 			curr.addEventListener('click', () => {
	// 				alert('success');
	// 				removeProductClick(curr.getAttribute('pro_handle'), customArray);
	// 				curr.querySelector('svg').setAttribute('fill', '#a7acb1');
	// 				curr.classList.replace('addedtowishlist_icon', 'addtowishlist_icon');
	// 				curr.id = 'addtowishlist_icon';
	// 				if (customerId != undefined) {
	// 					saveWishlistProducts(domain, wishlistProducts, customerId, shopName, shopId);
	// 				}
	// 				addWishlistBtn();
	// 			});
	// 		});
	// 	}
	// }

	removeProductClick = (handle, customArray) => {
		if ((customArray[0].allow_guest == '0' || customArray[0].allow_guest == null) && customerId == undefined) {
			window.location.href = '/account/login';
		} else {
			let productHandle = handle;
			if (customArray[0].categorised == '1') {
				let filteredArray = wishlistProducts.filter(item => {
					let cat = Object.values(item)[0];
					if (Array.isArray(cat)) {
						let index = cat.findIndex(p => p.pro_handle === productHandle);
						if (index != -1) {
							cat.splice(index, 1);
						}
					}
					return true;
				});
				wishlistProducts = filteredArray;
			} else {
				let productHandleIndex = wishlistProducts.findIndex(product => product.pro_handle === productHandle);
				wishlistProducts.splice(productHandleIndex, 1);
			}
			localStorage.setItem('wishlistProducts', JSON.stringify(wishlistProducts));
			setWishlistProductCount(wishlistProducts, customArray);
		}
	}

	addWishListButtonToProductPage = (customArray) => {
		let wishlistBtn = document.querySelector('.mag-pdp-wishlist');
		if (wishlistBtn) {
			let productId = wishlistBtn.getAttribute('data-product-id'),
				productHandle = wishlistBtn.getAttribute('data-product-handle');
			isExist = (customArray[0].categorised == '1') ? isCatHandleExist(wishlistProducts, productHandle) : isHandleExist(wishlistProducts, productHandle);
			if (isExist) {
				var wishListButton = `<div class='mag_wishlist_added button btn' id='addToWishlist' pro_handle='${productHandle}'>
					<a href='javascript:void(0)' class='view-wishlist button'>
					<svg xmlns="http://www.w3.org/2000/svg" fill="${(JSON.parse(customArray[0].wishlist_color_after) != null) ? hsbToHex(JSON.parse(customArray[0].wishlist_color_after)) : customArray[0].wishlist_color_after}" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
					<path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
					</svg>
						${customArray[0].text_for_view_to_wishlist}
					</a>
				</div>`;
			} else {
				if (customArray[0].wishlist_btn == 'heart-with-wishlist') {
					var wishListButton = `<div class='mag_wishlist button btn' id='addToWishlist' pro_handle='${productHandle}'>
						<a href='javascript:void(0)' class='addtowishlist_text button'>
							<svg xmlns="http://www.w3.org/2000/svg" fill="${(JSON.parse(customArray[0].wishlist_color_before) != null) ? hsbToHex(JSON.parse(customArray[0].wishlist_color_before)) : customArray[0].wishlist_color_before}" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
								<path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
							</svg>
							${customArray[0].text_for_add_to_wishlist}
						</a>
					</div>`;
				} else if (customArray[0].wishlist_btn == 'heart-wishlist') {
					var wishListButton = `<div class='mag_wishlist button btn' id='addToWishlist' pro_handle='${productHandle}'>
						<a href='javascript:void(0)' class='addtowishlist_text button'>
							<svg xmlns="http://www.w3.org/2000/svg" fill="${(JSON.parse(customArray[0].wishlist_color_before) != null) ? hsbToHex(JSON.parse(customArray[0].wishlist_color_before)) : customArray[0].wishlist_color_before}" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
								<path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
							</svg>
						</a>
					</div>`;
				} else if (customArray[0].wishlist_btn == 'wishlist') {
					var wishListButton = `<div class='mag_wishlist button btn' id='addToWishlist' pro_handle='${productHandle}'>
						<a href='javascript:void(0)' class='addtowishlist_text button'>
							${customArray[0].text_for_add_to_wishlist}
						</a>
					</div>`;
				} else if (customArray[0].wishlist_btn == 'heart-wishlist-view') {
					var wishListButton = `<div class='mag_wishlist button btn' id='addToWishlist' pro_handle='${productHandle}'>
						<a href='javascript:void(0)' class='addtowishlist_text button'>
							${customArray[0].text_for_add_to_wishlist}
							<svg xmlns="http://www.w3.org/2000/svg" fill="${(JSON.parse(customArray[0].wishlist_color_before) != null) ? hsbToHex(JSON.parse(customArray[0].wishlist_color_before)) : customArray[0].wishlist_color_before}" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
								<path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
							</svg>
						</a>
					</div>`;
				} else {
					var wishListButton = `<div class='mag_wishlist button btn' id='addToWishlist' pro_handle='${productHandle}'>
						<a href='javascript:void(0)' class='addtowishlist_text button'>
							<svg xmlns="http://www.w3.org/2000/svg" fill="${(JSON.parse(customArray[0].wishlist_color_before) != null) ? hsbToHex(JSON.parse(customArray[0].wishlist_color_before)) : customArray[0].wishlist_color_before}" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
								<path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
							</svg>
							${customArray[0].text_for_add_to_wishlist}
						</a>
					</div>`;
				}
			}
			wishlistBtn.innerHTML = wishListButton;
			document.querySelector('.mag_wishlist_added')?.addEventListener('click', () => {
				appendDataInTable();
			});

			if (wishlistBtn && wishlistBtn.querySelector('.mag_wishlist')) {
				wishlistBtn.querySelector('.mag_wishlist').addEventListener('click', () => {
					if ((customArray[0].allow_guest == '0' || customArray[0].allow_guest == null) && customerId == undefined) {
						window.location.href = '/account/login';
					} else {
						if (customArray[0].categorised == '1') {
							let currVar = null;
							let wishlistCategorys = wishlistProducts.reduce((categories, item) => {
								let category = Object.keys(item)[0],
									values = Object.values(item)[0];
								if (Array.isArray(values)) {
									categories.push(category);
								}
								return categories;
							}, []);
							customizedPopup(currVar, wishlistCategorys, productHandle, productId, customArray);
						} else {
							wishlistProducts.push({ "pro_handle": productHandle, "pro_id": productId });
							localStorage.setItem('wishlistProducts', JSON.stringify(wishlistProducts));
							let wishListButton = `<div class='mag_wishlist_added button btn'>
												<a href='javascript:void(0)' class='view-wishlist button'>
												<svg xmlns="http://www.w3.org/2000/svg" fill="${(JSON.parse(customArray[0].wishlist_color_after) != null) ? hsbToHex(JSON.parse(customArray[0].wishlist_color_after)) : customArray[0].wishlist_color_after}" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
												<path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
												</svg>
														${customArray[0].text_for_view_to_wishlist}
												</a>
										</div>`;
							wishlistBtn.innerHTML = wishListButton;
							if (document.querySelector('.mag_wishlist_added')) {
								document.querySelector('.mag_wishlist_added').addEventListener('click', () => {
									appendDataInTable();
								});
							}
							setWishlistProductCount(wishlistProducts, customArray);
							if (customerId != undefined) {
								saveWishlistProducts(domain, wishlistProducts, customerId, shopName, shopId);
							}
						}
					}
				});
			}
		}
	}

	appendDataInTable = () => {
		var productData = '';
		// async function fetchData() {
		productData += `<div class="popup popup-active">
				<div class="popup-overlay popup-toggle"></div>
				<div class="popup-main-wrapper wishlistbar-popup">
					<div class="popup-wrapper popup-transition">
						<div class="popup-header">
							<button class="popup-close popup-toggle">
								<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
									<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
								</svg>
							</button>
							<h2 class="popup-heading">ウィッシュリスト製品</h2>
						</div>
						<div class="popup-body">
							<div class="popup-content">
								<div class="bt-spinner"></div>
							</div>
						</div>
					</div>
				</div>
			</div>`;
		if (document.querySelector('.popup.popup-active')) {
			document.querySelector('.popup.popup-active').remove();
		}
		let htmlBtnElement = appendElementInHtml(productData);
		document.querySelector('body').insertAdjacentElement('afterbegin', htmlBtnElement);
		document.querySelector('body').classList.add('popup-open');
		document.querySelector('.popup-close.popup-toggle').addEventListener('click', () => {
			document.querySelector('.popup.popup-active').remove();
			document.querySelector('body').classList.remove('popup-open');
		})
		document.querySelectorAll('.mag-add-to-cart')?.forEach(curr => {
			curr.addEventListener('click', () => {
				let varId = curr.getAttribute('data-id'),
					proHandle = curr.getAttribute('data-handle');
				window.location.href = `/cart/add?id=${varId}&quantity=1`;
				removeProductClick(proHandle, customArray);
			});
		});
		wishlistProductsData()
		// }
	}

	wishlistProductsData = () => {
		let productData = '';
		let shopUrl = window.location.hostname;

		async function fetchData() {
			productData += `<div class='popupcontent'>
				<div class='popup-content-main header' style='max-width: 1000px'>
					<div class="mag-popup-pro-url">
						<div class="mag-popup-pro-checkbox">
							<input type="checkbox" class="magSelectAllCheckbox" id="magSelectAllCheckbox">
							<label for="magSelectAllCheckbox">すべて選択</label>
						</div>
					</div>
				</div>
				<div class="magProductScrollable">`;

			if (customArray[0].categorised == '1') {
				let filteredProducts = wishlistProducts.filter(product => {
					let keys = Object.keys(product);
					return keys.length === 1 && Array.isArray(product[keys[0]]);
				});
				if (filteredProducts.length > 0) {
					await Promise.all(filteredProducts.map(async curr => {
						await Promise.all(Object.values(curr).map(async (dhArray) => {
							if (dhArray.length > 0) {
								const dhResults = await Promise.all(dhArray.map(async (dh, index) => {
									let data = await getProductsAsync(dh.pro_handle);
									return `<div class='popup-content-main' style='max-width: 1000px' data-handle="${dh.pro_handle}">
										<div class="mag-popup-pro-url">
											<div class="mag-popup-pro-checkbox">
												<input type="checkbox" name="wishlistPro" class="wishlistPro" data-id="${data.variants[0].id}" data-handle="${dh.pro_handle}" data-cat="${Object.keys(curr)[0]}">
											</div>
											<div class="mag-popup-pro-image">
												<a href="${shopUrl}/products/${dh.pro_handle}">
												 <img src='${(data.image != null) ? data.image.src : "https://wishlist.myappgurus.com/public/guide_imgs/no-image.jpg"}' alt='${(data.image != null) ? data.image.alt : ""}'>
												</a>
											</div>
											<div class="mag-popup-content-wrapper">
												<div class="mag-popup-pro-title">
													${data.title}
												</div>
												<div class="mag-popup-pro-price">
													${formatMoney(data.variants[0].price, customArray[0].moneyFormat)}
												</div>
												<div class="mag-popup-pro-wrapper">
												<div class="mag-popup-pro-price">
													<div class="qty d-flex align-center">
														<a href="javascript:void(0)" class="qty-btn minus" data-id="${data.variants[0].id}" disabled>-</a>
														<input type="number" data-id="${data.variants[0].id}" value="1" min="1">
														<a href="javascript:void(0)" class="qty-btn plus" data-id="${data.variants[0].id}">+</a>
													</div>
												</div>
												<div class="mag-popup-pro-atc">
													<span class="magAddToCart" data-id="${data.variants[0].id}" data-handle="${dh.pro_handle}">
														<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart-plus" viewBox="0 0 16 16"><path d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9z"/><path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zm3.915 10L3.102 4h10.796l-1.313 7zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg>
													</span>
													<span class="magRemoveWishlist" data-id="${data.variants[0].id}" data-handle="${dh.pro_handle}" data-cat="${Object.keys(curr)[0]}">
													<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zM8 9h8v10H8zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
													</span>
												</div>
											</div>
										</div>
									</div>
								</div>`;
								}));
								productData += `<div class='popup-content-main category' style='max-width: 1000px' data-cat="${Object.keys(curr)[0]}">
									<div class="mag-category" data-cat="${Object.keys(curr)[0]}">
										<div class="mag-popup-pro-url">
											<h2>${Object.keys(curr)[0]}</h2>
										</div>
									</div>
									${dhResults.join('')}
								</div>`;
							}
						}));
					}));
				} else {
					productData += `<div class='popup-content-main no-products' style='max-width: 1000px'>ウィッシュリストの項目が見つかりませんでした。</div>`;
				}
			} else {
				let filteredProducts = wishlistProducts.filter(product => {
					let keys = Object.keys(product);
					return keys.length !== 1 && !Array.isArray(product[keys[0]]);
				});

				if (filteredProducts.length > 0) {
					await Promise.all(filteredProducts.map(async curr => {
						let data = await getProductsAsync(curr.pro_handle);
						productData += `<div class='popup-content-main' style='max-width: 1000px' data-handle="${curr.pro_handle}">
							<div class="mag-popup-pro-url">
								<div class="mag-popup-pro-checkbox">
									<input type="checkbox" name="wishlistPro" class="wishlistPro" data-id="${data.variants[0].id}" data-handle="${curr.pro_handle}">
								</div>
								<div class="mag-popup-pro-image">
									<a href="${shopUrl}/products/${curr.pro_handle}">
										<img src='${(data.image != null) ? data.image.src : "https://wishlist.myappgurus.com/public/guide_imgs/no-image.jpg"}' alt='${(data.image != null) ? data.image.alt : ""}'>
									</a>
								</div>
								<div class="mag-popup-content-wrapper">
									<div class="mag-popup-pro-title">
										${data.title}
									</div>
									<div class="mag-popup-pro-price">
										${formatMoney(data.variants[0].price, customArray[0].moneyFormat)}
									</div>
									<div class="mag-popup-pro-wrapper">
									<div class="mag-popup-pro-price">
										<div class="qty d-flex align-center">
											<a href="javascript:void(0)" class="qty-btn minus" data-id="${data.variants[0].id}" disabled>-</a>
											<input type="number" data-id="${data.variants[0].id}" value="1" min="1">
											<a href="javascript:void(0)" class="qty-btn plus" data-id="${data.variants[0].id}">+</a>
										</div>
									</div>
									<div class="mag-popup-pro-atc">
										<span class="magAddToCart" data-id="${data.variants[0].id}" data-handle="${curr.pro_handle}">
											<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart-plus" viewBox="0 0 16 16"><path d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9z"/><path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zm3.915 10L3.102 4h10.796l-1.313 7zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg>
										</span>
										<span class="magRemoveWishlist" data-id="${data.variants[0].id}" data-handle="${curr.pro_handle}">
										<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zM8 9h8v10H8zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>`;
					}));
				} else {
					productData += `<div class='popup-content-main no-products' style='max-width: 1000px'>ウィッシュリストの項目が見つかりませんでした。</div>`;
				}
			}
			productData += `</div>
				<div class='popup-content-main footer' style='max-width: 1000px'>
					<div class="mag-popup-pro-url">
						<div class="mag-popup-pro-action">
							<button class="mag-remove-wishlist btn button">クリア</button>
							<button class="mag-add-to-cart btn button">カートに追加</button>
						</div>
					</div>
				</div>
			</div>`;
			let appendEle = appendElementInHtml(productData);
			document.querySelector('.popup-content').innerHTML = productData;

			if (document.querySelector('.popup-content-main.no-products')) {
				document.querySelector('.popup-content-main.header').classList.add('hide');
				document.querySelector('.popup-content-main.footer').classList.add('hide');
			}
			wishlsitProductsAction();
		}
		var getProductsAsync = (pro_handle) => {
			return fetch(`/products/${pro_handle}.json`)
				.then(res => res.json())
				.then(data => data.product);
		}
		fetchData();
	};

	wishlsitProductsAction = () => {
		let selectAllCheckbox = document.querySelector('.magSelectAllCheckbox'),
			wishlistCheckbox = document.querySelectorAll('.wishlistPro'),
			wishlistProAddToCart = document.querySelectorAll('.magAddToCart'),
			wishlistProRemove = document.querySelectorAll('.magRemoveWishlist'),
			multipleAddToCart = document.querySelector('.mag-add-to-cart'),
			multipleRemove = document.querySelector('.mag-remove-wishlist'),
			qtyPlus = document.querySelectorAll('.qty-btn.plus'),
			qtyMinus = document.querySelectorAll('.qty-btn.minus'),
			itemsArray = [],
			proHandleArray = [];

		if (selectAllCheckbox) {
			selectAllCheckbox.addEventListener('click', () => {
				if (selectAllCheckbox.checked == true) {
					wishlistCheckbox.forEach(curr => {
						curr.checked = true;
					});
				} else {
					wishlistCheckbox.forEach(curr => {
						curr.checked = false;
					});
				}
				itemsArray = updateArray(wishlistCheckbox, { 'Wishlist': 'Mag' });
				proHandleArray = updateWishlistRemoveArray(wishlistCheckbox);
			});
		}

		if (wishlistCheckbox) {
			wishlistCheckbox.forEach(curr => {
				curr.addEventListener('click', () => {
					itemsArray = updateArray(wishlistCheckbox);
					proHandleArray = updateWishlistRemoveArray(wishlistCheckbox);
				});
			});
		}

		if (qtyMinus) {
			qtyMinus.forEach(curr => {
				curr.addEventListener('click', () => {
					let varId = curr.getAttribute('data-id'),
						qtyPicker = document.querySelector(`[type="number"][data-id="${varId}"]`);
					if (qtyPicker.value != 1) {
						qtyPicker.value = parseInt(qtyPicker.value) - 1;
						itemsArray = updateArray(wishlistCheckbox);
					}
				});
			});
		}

		if (qtyPlus) {
			qtyPlus.forEach(curr => {
				curr.addEventListener('click', () => {
					let varId = curr.getAttribute('data-id'),
						qtyPicker = document.querySelector(`[type="number"][data-id="${varId}"]`);
					qtyPicker.value = parseInt(qtyPicker.value) + 1;
					itemsArray = updateArray(wishlistCheckbox);
				});
			});
		}

		if (wishlistProAddToCart) {
			wishlistProAddToCart.forEach(curr => {
				curr.addEventListener('click', () => {
					let varId = curr.getAttribute('data-id'),
						qty = document.querySelector(`[type="number"][data-id="${varId}"]`).value;
					const properties = { 'Wishlist': 'Mag' };
					addItemToCart(varId, qty, properties);
					appendToast('Item added to cart', false);
				});
			});
		}

		// if (wishlistProRemove) {
		// 	wishlistProRemove.forEach(curr => {
		// 		curr.addEventListener('click', () => {
		// 			let handle = curr.getAttribute('data-handle'),
		// 					removeProduct = removeProductClick(handle, customArray);
		// 			if (customArray[0].categorised == '1') {
		// 				let category = curr.getAttribute('data-cat'),
		// 						updatedWishlist = removeObjectsByHandle(wishlistProducts, category, handle);
		// 				localStorage.setItem('wishlistProducts', JSON.stringify(updatedWishlist));
		// 				document.querySelector(`.popup-content-main[data-handle="${handle}"]`).remove();
		// 				if (document.querySelectorAll(`.popup-content-main.category[data-cat="${category}"] .popup-content-main`).length == 0) {
		// 					document.querySelector(`.popup-content-main.category[data-cat="${category}"]`).remove();
		// 				}
		// 			} else {
		// 				document.querySelector(`.wishlistBtn[pro_handle="${handle}"] svg`).setAttribute('fill', '#a7acb1');
		// 				document.querySelector(`.wishlistBtn[pro_handle="${handle}"] svg`).classList.remove('addedtowishlist_icon');
		// 				document.querySelector(`.popup-content-main[data-handle="${handle}"]`).remove();
		// 				filteredArray = originalArray.filter(item => item.pro_handle !== productHandleToRemove);
		// 			}
		// 			appendToast('Removed', false);
		// 		});
		// 	});
		// }

		if (wishlistProRemove) {
			wishlistProRemove.forEach(curr => {
				curr.addEventListener('click', () => {
					let handle = curr.getAttribute('data-handle');
					let category = curr.getAttribute('data-cat');
					let removeProduct = removeProductClick(handle, customArray);

					if (customArray[0].categorised == '1') {
						let updatedWishlist = removeObjectsByHandle(wishlistProducts, category, handle);
						localStorage.setItem('wishlistProducts', JSON.stringify(updatedWishlist));
						let popupToRemove = document.querySelector(`.popup-content-main[data-handle="${handle}"]`);
						if (popupToRemove) popupToRemove.remove();

						let categoryPopup = document.querySelector(`.popup-content-main.category[data-cat="${category}"]`);
						if (categoryPopup && document.querySelectorAll(`.popup-content-main.category[data-cat="${category}"] .popup-content-main`).length == 0) {
							categoryPopup.remove();
							removeProductClick(handle, customArray);
						}
					} else {
						let wishlistBtn = document.querySelector(`.wishlistBtn[pro_handle="${handle}"] svg`);
						if (wishlistBtn) {
							wishlistBtn.setAttribute('fill', '#a7acb1');
							wishlistBtn.classList.remove('addedtowishlist_icon');
						}
						let popupToRemove = document.querySelector(`.popup-content-main[data-handle="${handle}"]`);
						if (popupToRemove) popupToRemove.remove();
						let updatedWishlist = wishlistProducts.filter(item => item.pro_handle !== handle);
						localStorage.setItem('wishlistProducts', JSON.stringify(updatedWishlist));
					}
					appendToast('Removed', false);
					location.reload();
				});
			});
		}

		if (multipleAddToCart) {
			multipleAddToCart.addEventListener('click', () => {
				if (itemsArray.length > 0) {
					fetch(`${window.location.origin}/cart/add.js`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ items: itemsArray }),
					})
						.then(res => res.json())
						.then(response => {
							appendToast('Item added to cart', false);
							window.location.href = '/cart';
						});
				} else {
					appendToast('製品が選択されていません', true)
				}
			});
		}

		if (multipleRemove) {
			multipleRemove.addEventListener('click', () => {
				if (proHandleArray.length > 0) {
					let updatedWishlist = [];
					if (customArray[0].categorised == '1') {
						updatedWishlist = removeItemFromCategoryArray(wishlistProducts, proHandleArray);
					} else {
						updatedWishlist = wishlistProducts.filter(product => {
							return !proHandleArray.some(handle => handle.pro_handle === product.pro_handle);
						});
					}
					localStorage.setItem('wishlistProducts', JSON.stringify(updatedWishlist));
					appendToast('Removed', false);
					location.reload();
				} else {
					appendToast('製品が選択されていません', true);
				}
			});
		}
	}
});